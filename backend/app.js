const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const ConnectToDb = require('./database/db.js');
const BuyerRoutes = require('./Routes/Buyer.Routes.js');
const CartRoutes = require('./Routes/Cart.Routes.js');
const OwnerRoutes = require('./Routes/Owner.Routes.js');
const ProductRoutes = require('./Routes/product.route.js');
const cors = require('cors');
const OrderRoutes = require('./Routes/Order.Routes.js');

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174","https://attire-buyer.onrender.com","https://attire-admin-2cod.onrender.com"]; // Admin and User panels

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

ConnectToDb();

app.get('/', (req, res) => {
  res.send("hello world");
});

app.use('/buyer', BuyerRoutes);
app.use('/Cart', CartRoutes);
app.use('/owner', OwnerRoutes);
app.use('/product', ProductRoutes);
app.use('/order',OrderRoutes);

module.exports = app;