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
  useEffect(() => {
    const getUser = async () => {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;
  
      if (user) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/owner/register`, {
            name: user.user_metadata.full_name,
            email: user.email,
            provider: "google",
          });
  
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("tokenTimestamp", new Date().getTime().toString());
          setOwner(response.data.user); // Or .owner depending on your response
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
      navigate("/"); // Redirect to home page after logout
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

  const addProduct = async (formData) => {
    try {
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.products; // Return the list of products
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.product; // Return the updated product
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { deleteAllStock, stockToDelete }, // Pass the delete options
        }
      );
      return response.data.message; // Return the success message
    } catch (error) {
      console.error("Error deleting product:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchOrders = async (status = '', page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/getorders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          status, // Optional: Filter orders by status (e.g., "pending", "completed")
          page,   // Optional: Specify the page number for pagination
          limit,  // Optional: Specify the number of orders per page
        },
      });
      console.log("Orders:", response.data); // Log the fetched orders
      return response.data; // Return the full response (orders, totalPages, currentPage)
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data?.message || error.message);
      throw error;
    }
  };
  const fetchBuyerDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/buyers-with-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.buyers; // Return the list of buyers with their details
    } catch (error) {
      console.error("Error fetching buyer details:", error.response?.data?.message || error.message);
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

// Custom hook to use the OwnerContext
export const useOwner = () => {
  return useContext(OwnerContext);
};