// pages/Landing.jsx
import React, { useEffect } from "react";
import HeroSection from "../components/Landing/HeroSection";
import FeatureSection from "../components/Landing/FeatureSection";
import Testimonial from "../components/Landing/Testimonial";
import Pricing from "../components/Landing/Pricing";
import CallToAction from "../components/Landing/CallToAction";
import Footer from "../components/Landing/Footer";
import { useClerk, useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../utils/apienpoints";


function Landing() {
  const { openSignUp, openSignIn } = useClerk();
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const go = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const token = await getToken(); // if you configured a template, use getToken({ template: 'spring' })
          const res = await fetch(API_ENDPOINTS.GET_PROFILE, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profile = await res.json();
          // assuming profile.role returns 'ADMIN' or 'USER'
          if (profile?.role === "ADMIN") navigate("/admin");
          else navigate("/dashboard");
        } catch (e) {
          // fallback
          navigate("/dashboard" );
        }
      }
    };
    go();
  }, [isLoaded, isSignedIn, navigate, getToken]);

  return (
    <div className="w-full h-screen bg-[#eeefff]">
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
      <FeatureSection />
      <Pricing openSignUp={openSignUp} />
      <Testimonial />
      <CallToAction openSignUp={openSignUp} />
      <Footer />
    </div>
  );
}

export default Landing;