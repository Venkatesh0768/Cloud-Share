import React, { useEffect } from "react";
import HeroSection from "../components/Landing/HeroSection";
import FeatureSection from "../components/Landing/FeatureSection";
import Testimonial from "../components/Landing/Testimonial";
import Pricing from "../components/Landing/Pricing";
import CallToAction from "../components/Landing/CallToAction";
import Footer from "../components/Landing/Footer";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const { openSignUp, openSignIn } = useClerk();
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard");
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="w-full h-screen bg-[#eeefff]">
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
      <FeatureSection />
      <Pricing openSignUp={openSignUp} />
      <Testimonial />
      <CallToAction  openSignUp={openSignUp}/>
      <Footer />
    </div>
  );
}

export default Landing;
