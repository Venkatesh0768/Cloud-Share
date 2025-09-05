import { useContext, useEffect, useRef, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth, useUser } from "@clerk/clerk-react";
import { UserCreditContext } from "../context/UserCreditContext";
import { API_ENDPOINTS } from "../utils/apienpoints";
import axios from "axios";
import { AlertCircle, Check, CreditCard, Loader2 } from "lucide-react";
import { pricingPlans } from "../assets/data";

function Subscription() {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [currentProcessingPlan, setCurrentProcessingPlan] = useState(null);
  
  const { user } = useUser();
  const { getToken } = useAuth();
  const razorpayScriptRef = useRef(null);
  const { credits, setCredits, fetchUserCredits } = useContext(UserCreditContext);

  // Input validation for plans
  const validatePlan = (plan) => {
    if (!plan || typeof plan.price !== 'number' || plan.price < 0) {
      return false;
    }
    if (!plan.id || typeof plan.id !== 'string') {
      return false;
    }
    return true;
  };

  const handlePayment = async (plan) => {
    if (!validatePlan(plan)) {
      setMessage("❌ Invalid plan data");
      setMessageType("error");
      return;
    }

    // Prevent multiple simultaneous payments
    if (processingPayment) {
      return;
    }

    // Handle free plan instantly (no Razorpay)
    if (plan.price === 0) {
      setCurrentProcessingPlan(plan.id);
      try {
        // You might want to call an API to activate free plan instead
        setCredits(5); // free plan credits
        setMessage("✅ Free plan activated!");
        setMessageType("success");
      } catch (error) {
        setMessage("❌ Failed to activate free plan" , error);
        setMessageType("error");
      } finally {
        setCurrentProcessingPlan(null);
      }
      return;
    }

    if (!razorpayLoaded) {
      setMessage("Payment system not ready yet, please try again later.");
      setMessageType("error");
      return;
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      setMessage("❌ User email not found. Please ensure your profile is complete.");
      setMessageType("error");
      return;
    }

    setProcessingPayment(true);
    setCurrentProcessingPlan(plan.id);
    setMessage("");

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      // Create order with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await axios.post(
        API_ENDPOINTS.CREATE_ORDER,
        {
          planId: plan.id,
          amount: plan.price * 100, // Convert to paisa
          currency: "INR",
          credits: plan.credits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.data.success) {
        throw new Error(response.data.message || "Order creation failed");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: "INR",
        name: "CloudShare",
        description: `Purchase ${plan.credits} credits - ${plan.name} Plan`,
        order_id: response.data.orderId,
        timeout: 300, // 5 minutes
        retry: {
          enabled: false // Disable retry to prevent double payments
        },
        handler: async function (razorpayResponse) {
          await handlePaymentSuccess(razorpayResponse, plan, token);
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            setCurrentProcessingPlan(null);
            setMessage("Payment cancelled");
            setMessageType("info");
          }
        },
        prefill: {
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.primaryEmailAddress.emailAddress,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        
        // Handle payment failure
        razorpay.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          setMessage(`❌ Payment failed: ${response.error.description}`);
          setMessageType("error");
          setProcessingPayment(false);
          setCurrentProcessingPlan(null);
        });

        razorpay.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      
      let errorMessage = "❌ Failed to initiate payment. ";
      if (error.name === 'AbortError') {
        errorMessage += "Request timed out. Please try again.";
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += "Please try again later.";
      }
      
      setMessage(errorMessage);
      setMessageType("error");
      setProcessingPayment(false);
      setCurrentProcessingPlan(null);
    }
  };

  const handlePaymentSuccess = async (razorpayResponse, plan, token) => {
    try {
      const verifyResponse = await axios.post(
        API_ENDPOINTS.VERIFY_PAYMENT,
        {
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          planId: plan.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (verifyResponse.data.success) {
        if (verifyResponse.data.credits !== undefined) {
          setCredits(verifyResponse.data.credits);
        } else {
          await fetchUserCredits();
        }
        setMessage(`✅ Payment successful! ${plan.name} plan activated with ${plan.credits} credits.`);
        setMessageType("success");
        
        // Clear message after 10 seconds
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 10000);
      } else {
        setMessage("❌ Payment verification failed. Please contact support with your payment ID.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setMessage("❌ Payment verification failed. Your payment was processed but credits may not be added. Please contact support.");
      setMessageType("error");
    } finally {
      setProcessingPayment(false);
      setCurrentProcessingPlan(null);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        setMessage(
          "❌ Payment gateway failed to load. Please refresh the page and try again."
        );
        setMessageType("error");
      };

      document.body.appendChild(script);
      razorpayScriptRef.current = script;
    } else {
      setRazorpayLoaded(true);
    }

    return () => {
      if (razorpayScriptRef.current && document.body.contains(razorpayScriptRef.current)) {
        document.body.removeChild(razorpayScriptRef.current);
      }
    };
  }, []);

  // Fetch user credits on component mount
  useEffect(() => {
    const fetchUserCreditsFromApi = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await axios.get(API_ENDPOINTS.GET_CREDITS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        });
        
        if (response.data && typeof response.data.credits === 'number') {
          setCredits(response.data.credits);
        }
      } catch (error) {
        console.error("Error fetching user credits:", error);
        if (error.response?.status !== 401) { // Don't show error for auth issues
          setMessage("⚠️ Failed to load your current credits. Please refresh the page.");
          setMessageType("error");
        }
      }
    };

    fetchUserCreditsFromApi();
  }, [getToken, setCredits]);

  return (
    <DashboardLayout activeTab="Subscriptions">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-gray-600 mb-6">Choose a plan that works for you</p>

        {/* Status Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {messageType === "error" && <AlertCircle size={20} />}
            {messageType === "success" && <Check size={20} />}
            <span>{message}</span>
          </div>
        )}

        {/* Current Credits Display */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-purple-500" size={24} />
              <h2 className="text-lg font-medium">
                Current Credits:{" "}
                <span className="font-bold text-purple-600">{credits}</span>
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              You can upload {credits} more files with your current credits
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-200 ${
                plan.isPopular
                  ? "bg-gradient-to-b from-purple-50 to-white border-2 border-purple-600 shadow-xl transform scale-105"
                  : "bg-white border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 right-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-500 mb-6">{plan.description}</p>

              <div className="mb-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  ₹{plan.price.toLocaleString()}
                </span>
                {plan.price > 0 && <span className="text-gray-500">one-time</span>}
              </div>

              <hr className="my-6 border-gray-200" />

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-x-3">
                    <Check className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg"
                    : "bg-gray-100 text-purple-700 hover:bg-gray-200"
                } ${
                  processingPayment ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={processingPayment}
              >
                {currentProcessingPlan === plan.id ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText || `Get ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Loading State for Razorpay */}
        {!razorpayLoaded && (
          <div className="mt-8 text-center text-gray-500">
            <Loader2 className="animate-spin inline-block mr-2" size={16} />
            Loading payment system...
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Subscription;