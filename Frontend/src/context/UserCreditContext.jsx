import { useAuth } from "@clerk/clerk-react";
import { createContext, useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../utils/apienpoints";
import toast from "react-hot-toast";

export const UserCreditContext = createContext();

export const UserCreditsProvider = ({ children }) => {
  const [credits, setCredits] = useState(5);
  const [plan, setPlan] = useState("FREE");
  const [loading, setLoading] = useState(false);
  const { isSignedIn, getToken } = useAuth();

  const fetchUserCredits = useCallback(async () => {
    if (!isSignedIn) return;

    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.GET_CREDITS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Credits API response:", data);

      if (response.ok) {
        setCredits(data.credits);
        setPlan(data.plan);
      } else {
        toast.error(`Failed to fetch credits: ${data?.message || ""}`);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
      toast.error("Something went wrong while fetching credits");
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      fetchUserCredits();
    }
  }, [fetchUserCredits, isSignedIn]);

  const updateCredits = useCallback((amount) => {
    setCredits((prevCredits) => Math.max(0, prevCredits + amount));
  }, []);

  const contextValue = {
    credits,
    plan,
    loading,
    fetchUserCredits,
    updateCredits,
    setCredits, // ✅ exposed so Subscription can directly update
  };

  return (
    <UserCreditContext.Provider value={contextValue}>
      {children}
    </UserCreditContext.Provider>
  );
};
