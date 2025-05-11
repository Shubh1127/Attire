import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import supabase from "../Auth/supabaseClient";
import { useNavigate } from "react-router-dom";

const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios to send credentials with every request
  axios.defaults.withCredentials = true;

  // Helper function to check token expiration
  const isTokenExpired = () => {
    const tokenTimestamp = getCookie("tokenTimestamp");
    if (!tokenTimestamp) return true;

    const now = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return now - parseInt(tokenTimestamp, 10) > sevenDaysInMs;
  };
  if (isTokenExpired()) {
  console.error('Token has expired. Redirecting to login...');
  navigate('/auth'); // Redirect to login page
}

  // Check for an authenticated owner on component mount
  useEffect(() => {
    const getSession = async () => {
      if (isTokenExpired()) {
        deleteCookie("token");
        deleteCookie("tokenTimestamp");
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

  // Register owner with email and password
  const registerWithEmail = async (name, email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/owner/register`,
        { name, email, password, provider: "local" },
        { withCredentials: true }
      );

      setOwner(response.data.owner);
      setCookie("token", response.data.token, 7);
      setCookie("tokenTimestamp", new Date().getTime().toString(), 7);
      return response.data.owner;
    } catch (error) {
      console.error("Error registering owner:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Handle Google registration
  useEffect(() => {
    const getUser = async () => {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;

      if (user) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/owner/register`,
            { name: user.user_metadata.full_name, email: user.email, provider: "google" },
            { withCredentials: true }
          );

          setCookie("token", response.data.token, 7);
          setCookie("tokenTimestamp", new Date().getTime().toString(), 7);
          setOwner(response.data.user);
        } catch (err) {
          console.error("Backend registration failed:", err.response?.data?.message || err.message);
        }
      }
    };

    getUser();
  }, []);

  const registerWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  // Login with email
  const loginWithEmail = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/owner/login`,
        { email, password },
        { withCredentials: true }
      );
      
      setOwner(response.data.owner);
      setCookie("token", response.data.token, 7);
      setCookie("tokenTimestamp", new Date().getTime().toString(), 7);
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
      navigate("/");
      await supabase.auth.signOut();
      deleteCookie("token");
      deleteCookie("tokenTimestamp");
      localStorage.removeItem("user");
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/owner/logout`, {
          withCredentials: true
        });
      } catch (err) {
        console.log(err.message);
      }
      setOwner(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Update profile picture
  const updateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/owner/updateProfilePicture`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOwner((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
      return response.data.profilePicture;
    } catch (error) {
      console.error("Error updating profile picture:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/owner/updatePassword`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      return response.data.message;
    } catch (error) {
      console.error("Error updating password:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Fetch owner data
  const fetchOwnerData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/owner/profile`, {
        withCredentials: true
      });
      setOwner(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching owner data:", error.response?.data?.message || error.message);
    }
  };

  // Product management functions
  const addProduct = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/product/add`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/all`, {
        withCredentials: true
      });
      return response.data.products;
    } catch (error) {
      console.error("Error fetching products:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const editProduct = async (productId, updates) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/product/edit/${productId}`,
        updates,
        { withCredentials: true }
      );
      return response.data.product;
    } catch (error) {
      console.error("Error editing product:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const deleteProduct = async (productId, deleteAllStock, stockToDelete) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/product/delete/${productId}`,
        {
          withCredentials: true,
          data: { deleteAllStock, stockToDelete },
        }
      );
      return response.data.message;
    } catch (error) {
      console.error("Error deleting product:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Order management functions
  const fetchOrders = async (status = '', page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/getorders`, {
        withCredentials: true,
        params: { status, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchBuyerDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/order/buyers-with-orders`,
        { withCredentials: true }
      );
      return response.data.buyers;
    } catch (error) {
      console.error("Error fetching buyer details:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchSalesAnalytics = async (period = "month") => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/analytics/sales`, {
      withCredentials: true,
      params: { period },
    });
    return response.data.salesData;
  } catch (error) {
    console.error("Error fetching sales analytics:", error.response?.data?.message || error.message);
    throw error;
  }
};
  return (
    <OwnerContext.Provider
      value={{
        owner,
        loading,
        fetchOrders,
        fetchBuyerDetails,
        registerWithEmail,
        fetchSalesAnalytics,
        registerWithGoogle,
        loginWithEmail,
        fetchProducts,
        updateProfilePicture,
        updatePassword,
        editProduct,
        fetchOwnerData,
        deleteProduct,
        addProduct,
        signOut,
      }}
    >
      {!loading && children}
    </OwnerContext.Provider>
  );
};

export const useOwner = () => useContext(OwnerContext);

// Cookie helper functions
export const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};