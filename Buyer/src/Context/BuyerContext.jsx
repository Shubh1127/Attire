import React, { createContext, useContext, useState,useEffect } from "react";
import axios from "axios";
import supabase from "../Auth/SupabaseClient";
import { useNavigate } from "react-router-dom";

const BuyerContext = createContext();
const API_URL = import.meta.env.VITE_BACKEND_URL;
export const BuyerProvider = ({ children }) => {
  
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(false);

  const isTokenExpired = () => {
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");
    if (!tokenTimestamp) return true;

    const now = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return now - parseInt(tokenTimestamp, 10) > sevenDaysInMs;
  };

  // Check for an authenticated buyer on component mount
  useEffect(() => {
    const getSession = async () => {
      if (isTokenExpired()) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenTimestamp");
        localStorage.removeItem("buyer");
        setBuyer(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setBuyer(data.session?.user || null);
      }
      setLoading(false);
    };
    getSession();
  }, []);

  // Register buyer with email and password (MongoDB)
  const registerWithEmail = async (name, email, password, phoneNumber) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/buyer/register`, {
        name,
        email,
        password,
        phoneNumber,
        provider: "local",
      });

      setBuyer(response.data.buyer);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("tokenTimestamp", new Date().getTime().toString()); // Save token timestamp
      return response.data.buyer;
    } catch (error) {
      console.error("Error registering buyer:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Register buyer with Google
  // Register buyer with Google
const registerWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,  // 👈 dynamic, wherever frontend is hosted
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error("Google sign-in error:", error.message);
  }
};


  // Automatically register or log in the buyer after Google sign-in
  useEffect(() => {
    const getUser = async () => {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;

      if (user) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/buyer/register`, {
            name: user.user_metadata.full_name,
            email: user.email,
            provider: "google",
          });

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("tokenTimestamp", new Date().getTime().toString());
          setBuyer(response.data.buyer);
        } catch (err) {
          console.error("Backend registration failed:", err.response?.data?.message || err.message);
        }
      }
    };

    getUser();
  }, []);

  // Login buyer with email and password
  const loginWithEmail = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/buyer/login`, {
        email,
        password,
      });
      setBuyer(response.data.buyer);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("tokenTimestamp", new Date().getTime().toString()); // Save token timestamp
      localStorage.setItem("buyer", JSON.stringify(response.data.buyer));
      return response.data.buyer;
    } catch (error) {
      console.error("Error logging in:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Logout buyer
  const logoutBuyer = async () => {
    try {
      navigate("/"); // Redirect to home page after logout
      await supabase.auth.signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenTimestamp");
      localStorage.removeItem("buyer");
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/buyer/logout`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (err) {
        console.log(err.message);
      }
      setBuyer(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Fetch buyer profile
  const getProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/buyer/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBuyer(response.data.buyer); // Update the buyer state with the fetched data
      localStorage.setItem("buyer", JSON.stringify(response.data.buyer)); // Update localStorage
    } catch (error) {
      console.error("Error fetching buyer data:", error.response?.data?.message || error.message);
    }
  };
 
  const addToCart = async (productId, quantity = 1, size, color) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/addToCart`,
        { productId, quantity, size, color },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setBuyer((prevBuyer) => ({
        ...prevBuyer,
        cart: response.data.cart, // Update the cart in the buyer state
      }));
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data?.message || error.message);
      alert('Failed to add item to cart.');
    }
  };
  // Update Buyer Profile
  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/buyer/updateprofile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setBuyer(response.data.buyer);
      return response.data.buyer;
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add Address
  const addAddress = async (address) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/buyer/addAddress`, address, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBuyer(response.data.buyer);
      return response.data.buyer;
    } catch (error) {
      console.error("Error adding address:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update Address
  const updateAddress = async (index, address) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/buyer/address/${index}`, address, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBuyer(response.data.buyer);
      return response.data.buyer;
    } catch (error) {
      console.error("Error updating address:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete Address
  const deleteAddress = async (index) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/buyer/address/${index}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBuyer(response.data.buyer);
      return response.data.buyer;
    } catch (error) {
      console.error("Error deleting address:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Set Default Address
  const setDefaultAddress = async (index) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/buyer/address/default/${index}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBuyer(response.data.buyer);
      return response.data.buyer;
    } catch (error) {
      console.error("Error setting default address:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Search Items
  const searchItems = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/buyer/search`, {
        params: { query },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching items:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/getProducts`);
      setAllProducts(response.data.products); // Save products in state
    } catch (error) {
      console.error('Error fetching products:', error.response?.data?.message || error.message);
    }
  };


  const fetchProductById=async(id)=>{
    try{
      const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/getProduct/${id}`)
      return response.data.product;

    }catch(er){
      console.error('Error fetching product by ID:', error.response?.data?.message || error.message);
    }

  }
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/getcart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBuyer((prevBuyer) => ({
        ...prevBuyer,
        cart: response.data.cart, // Update the cart in the buyer state
      }));
    } catch (error) {
      console.error('Error fetching cart:', error.response?.data?.message || error.message);
    }
  };
  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/updatecart`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setBuyer((prevBuyer) => ({
        ...prevBuyer,
        cart: response.data.cart, // Update the cart in the buyer state
      }));
    } catch (error) {
      console.error('Error updating cart:', error.response?.data?.message || error.message);
      alert('Failed to update cart.');
    }
  };
  
  const deleteCartItem = async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/deletecart`, {
        data: { productId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBuyer((prevBuyer) => ({
        ...prevBuyer,
        cart: response.data.cart, // Update the cart in the buyer state
      }));
    } catch (error) {
      console.error('Error deleting cart item:', error.response?.data?.message || error.message);
      alert('Failed to remove item from cart.');
    }
  };
  return (
    <BuyerContext.Provider
      value={{
        buyer,
        loading,
        addToCart,
        fetchCart,
        updateCartItem,
        deleteCartItem,
        registerWithEmail,
        loginWithEmail,
        registerWithGoogle,
        logoutBuyer,
        fetchProductById,
        fetchAllProducts,
        allProducts,
        getProfile,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        searchItems,
      }}
    >
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyerContext = () => useContext(BuyerContext);