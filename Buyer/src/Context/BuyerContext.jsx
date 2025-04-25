import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const BuyerContext = createContext();

export const BuyerProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Register Buyer
  const registerBuyer = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/buyer/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBuyer(response.data.buyer);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Error registering buyer:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login Buyer
  const loginBuyer = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/buyer/login`, credentials);
      setBuyer(response.data.buyer);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      console.error("Error logging in buyer:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout Buyer
  const logoutBuyer = async () => {
    try {
      setLoading(true);
      await axios.get(`${API_URL}/buyer/logout`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBuyer(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error logging out buyer:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get Buyer Profile
  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/buyer/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBuyer(response.data.buyer);
      return response.data.buyer;
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update Buyer Profile
  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/buyer/updateprofile`, formData, {
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
  return (
    <BuyerContext.Provider
      value={{
        buyer,
        loading,
        registerBuyer,
        loginBuyer,
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