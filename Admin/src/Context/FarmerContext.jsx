import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmerContext = createContext();

export const useFarmer = () => {
  return useContext(FarmerContext);
};

export const FarmerProvider = ({ children }) => {
  const [buyers, setBuyers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryLength,setInventoryLength] = useState(0);
  const [totalItems,setTotalItems] = useState(0);
  const [farmer, setFarmer] = useState(null);
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedTime = localStorage.getItem('tokenTime');
    const storedFarmer = localStorage.getItem('farmer');

    if (token && storedTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - storedTime;

      // Check if the token is older than 24 hours
      if (elapsedTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTime');
        localStorage.removeItem('farmer');
        setFarmer(null);
      } else {
        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        if (storedFarmer) {
          setFarmer(JSON.parse(storedFarmer));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (farmer) {
      localStorage.setItem('farmer', JSON.stringify(farmer));
    } else {
      localStorage.removeItem('farmer');
    }
  }, [farmer]);

  const signup = async (user) => {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('phoneNumber', user.phoneNumber);
    formData.append('profileImage', user.profileImage);

    try {
      const response = await axios.post('https://supply-chain-igtk.onrender.com/farmer/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.token) {
        const currentTime = new Date().getTime();
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tokenTime', currentTime);
        localStorage.setItem('farmer', JSON.stringify(response.data.farmer));
        setFarmer(response.data.farmer);
      }

      setMessage(response.data.message);
      navigate('/role/farmer/');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://supply-chain-igtk.onrender.com/farmer/login', { email, password });

      if (response.data.token) {
        const currentTime = new Date().getTime();
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tokenTime', currentTime);
        localStorage.setItem('farmer', JSON.stringify(response.data.farmer));
        axios.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;
        setFarmer(response.data.farmer);
      }

      setMessage(response.data.message);
      navigate('/role/farmer/');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://supply-chain-igtk.onrender.com/farmer/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('farmer');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenTime');
      setFarmer(null);

      console.log(response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://supply-chain-igtk.onrender.com/farmer/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFarmer(response.data.farmer);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const updateProfile = async (user) => {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('phone', user.phoneNumber);
    formData.append('address[houseNo]', user.address.houseNo);
    formData.append('address[street]', user.address.street);
    formData.append('address[city]', user.address.city);
    formData.append('address[state]', user.address.state);
    formData.append('address[pincode]', user.address.pincode);

    if (user.profileImage) {
      formData.append('profileImage', user.profileImage);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('https://supply-chain-igtk.onrender.com/farmer/updateprofile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
    }
  };

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://supply-chain-igtk.onrender.com/farmer/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const products = Array.isArray(response.data) ? response.data : response.data.products;
      setInventory(products);
      setCategories(products.map((product) => product.category));
      setInventoryLength(products.length);
      setTotalItems(products.length);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const addProduct = async (product) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('quantity', product.quantity);
    formData.append('category',product.category)
    formData.append('productImage', product.productImage);

    try {
      const response = await axios.post('https://supply-chain-igtk.onrender.com/farmer/addproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      if(response.data.message){
        setMessage(response.data.message);
      }

    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
    }
  };

  const getWeather = async (lat, lon) => {
    try {
      const response = await axios.get(`https://supply-chain-igtk.onrender.com/farmer/weather?lat=${lat}&lon=${lon}`);
      setWeather(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
    }
  };

  const fetchBuyers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://supply-chain-igtk.onrender.com/farmer/buyers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBuyers(response.data.buyers);
    } catch (error) {
      console.error('Error fetching buyers:', error.response?.data?.message || error.message);
    }
  };

  const getMessagesByRoomId = async (roomId) => {
    const token=localStorage.getItem('token');
    try {
      const response = await axios.get(`https://supply-chain-igtk.onrender.com/farmer/messages/${roomId}`,{
        headers:{
          'Auhtorization':`Bearer ${token}`
        }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile();
      fetchInventory();
      fetchBuyers();
    }
  }, []);

  return (
    <FarmerContext.Provider value={{ farmer, signup, login, logout, getProfile, updateProfile, addProduct, getWeather, weather,fetchInventory,totalItems,inventory,inventoryLength,
    categories,buyers,fetchBuyers,messages,getMessagesByRoomId,
    message }}>
      {children}
    </FarmerContext.Provider>
  );
};
