import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import  supabase  from "../Auth/supabaseClient";

const AdminProtected = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check local token
      const token = localStorage.getItem("token");
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");

      const isLocalTokenValid = () => {
        if (!token || !tokenTimestamp) return false;
        const now = new Date().getTime();
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        return now - parseInt(tokenTimestamp, 10) <= sevenDaysInMs;
      };

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      if (session || isLocalTokenValid()) {
        setIsAuthenticated(true);
      } else {
        // Clean up local storage
        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) return null; // Optional: show spinner while checking auth

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default AdminProtected;
