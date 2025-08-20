import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Lock,
  BarChart3,
  Cloud,
  Zap,
  CheckCircle,
} from "lucide-react";

function HeroSection({openSignIn, openSignUp}) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#eeefff] to-white">
      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 md:pb-24 flex flex-col items-center">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Share files securely with
        </motion.h1>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-center text-purple-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          CloudShare
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-zinc-600 text-center max-w-3xl mb-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Upload, Manage, and Share your files Securely. Accessible anywhere,
          anytime.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button onClick={()=> openSignUp()} className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 hover:shadow-xl">
            Get Started <ArrowRight size={20} />
          </button>
          <button onClick={()=> openSignIn()} className="flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-50 transition-all duration-300 border border-gray-200">
            Sign In
          </button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="w-full max-w-6xl px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <img
              src="https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
              alt="CloudShare Dashboard"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <motion.p
            className="text-lg text-zinc-600 text-center mt-8 max-w-2xl mx-auto flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Shield className="text-green-500" size={20} />
            All your files are encrypted and stored securely with
            enterprise-grade security protocols
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;
