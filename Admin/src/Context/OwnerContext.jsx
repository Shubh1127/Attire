import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import supabase from "../Auth/supabaseClient";
import { useNavigate } from "react-router-dom";
const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to check token expiration
  const isTokenExpired = () => {
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");
    if (!tokenTimestamp) return true;

    const now = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return now - parseInt(tokenTimestamp, 10) > sevenDaysInMs;
  };

  // Check for an authenticated owner on component mount
  useEffect(() => {
    const getSession = async () => {
      if (isTokenExpired()) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");
        localStorage.removeItem("user");
        setOwner(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setOwner(data.session?.user || null);
      }
      setLoading(false);
    };
    getSession();
  }, []);

  // Register owner with email and password (MongoDB)
  const registerWithEmail = async (name, email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/owner/register`, {
        name,
        email,
        password,
        provider: "local",
      });

      setOwner(response.data.owner);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("tokenTimestamp", new Date().getTime().toString()); // Save token timestamp
      return response.data.owner;
    } catch (error) {
      console.error("Error registering owner:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Register owner with Google (Supabase + MongoDB)
  const registerWithGoogle = async () => {
    try {
      // Initiate Google OAuth sign-in
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
  
      if (error) throw error;
  
      // Wait for the Supabase session to be established
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;
  
      if (user) {
        // Send a request to the backend to register the user
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/owner/register`, {
          name: user.user_metadata.full_name, // Full name from Google
          email: user.email, // Email from Google
          provider: "google", // Indicate the provider is Google
        });
  
        // Store the token and user details in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("tokenTimestamp", new Date().getTime().toString()); // Save token timestamp
        setOwner(response.data.owner); // Update the owner state with the backend response
        return response.data.owner;
      } else {
        throw new Error("Google sign-in failed or user session not established.");
      }
    } catch (error) {
      console.error("Error registering with Google:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/owner/login`, {
        email,
        password,
      });
      setOwner(response.data.owner);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("tokenTimestamp", new Date().getTime().toString()); // Save token timestamp
      localStorage.setItem("user", JSON.stringify(response.data.owner));
      return response.data.owner;
    } catch (error) {
      console.error("Error logging in:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");
      localStorage.removeItem("user");
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/owner/logout`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      navigate("/"); // Redirect to home page after logout
      } catch (err) {
        console.log(err.message);
      }
      setOwner(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/owner/updateProfilePicture`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setOwner((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
      return response.data.profilePicture;
    } catch (error) {
      console.error("Error updating profile picture:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/owner/updatePassword`, {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data.message;
    } catch (error) {
      console.error("Error updating password:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchOwnerData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/owner/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOwner(response.data); // Update the owner state with the fetched data
      localStorage.setItem("user", JSON.stringify(response.data)); // Update localStorage
    } catch (error) {
      console.error("Error fetching owner data:", error.response?.data?.message || error.message);
    }
  };

  const addProduct = async (productData, photos) => {
    try {
      const formData = new FormData();
      console.log("Product Data:", productData);
      console.log("Photos:", photos);
  
      photos.forEach((photo) => formData.append("photo", photo));
      Object.keys(productData).forEach((key) => formData.append(key, productData[key]));
  
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  return (
    <OwnerContext.Provider
      value={{
        owner,
        loading,
        registerWithEmail,
        registerWithGoogle,
        loginWithEmail,
        updateProfilePicture,
        updatePassword,
        fetchOwnerData,
        addProduct,
        signOut,
      }}
    >
      {!loading && children}
    </OwnerContext.Provider>
  );
};

// Custom hook to use the OwnerContext
export const useOwner = () => {
  return useContext(OwnerContext);
};