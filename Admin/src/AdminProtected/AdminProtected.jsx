import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../Auth/supabaseClient";
import { getCookie } from "../Context/OwnerContext"; // Import your cookie utility

const AdminProtected = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check cookie token
        const token = getCookie("token");
        const tokenTimestamp = getCookie("tokenTimestamp");

        const isTokenValid = () => {
          if (!token || !tokenTimestamp) return false;
          const now = new Date().getTime();
          const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
          return now - parseInt(tokenTimestamp, 10) <= sevenDaysInMs;
        };

        // Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        // Authenticated if either exists
        setIsAuthenticated(!!(token || session?.user));
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default AdminProtected;