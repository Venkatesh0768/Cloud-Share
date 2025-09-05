// routes/AdminRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { API_ENDPOINTS } from "./apienpoints";


export default function AdminRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [state, setState] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    const check = async () => {
      if (!isLoaded) return;
      if (!isSignedIn) {
        setState({ loading: false, isAdmin: false });
        return;
      }
      try {
        const token = await getToken();
        const res = await fetch(API_ENDPOINTS.GET_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = await res.json();
        setState({ loading: false, isAdmin: profile?.role === "ADMIN" });
      } catch {
        setState({ loading: false, isAdmin: false });
      }
    };
    check();
  }, [isLoaded, isSignedIn, getToken]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Checking permissions…</span>
      </div>
    );
  }

  return state.isAdmin ? children : <Navigate to="/dashboard" replace />;
}