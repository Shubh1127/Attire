const express=require('express')
require('dotenv').config();
const cookieParser=require('cookie-parser')
const ConnectToDb=require('./database/db.js')
const BuyerRoutes=require('./Routes/Buyer.Routes.js')
const CartRoutes=require('./Routes/Cart.Routes.js')
const OwnerRoutes=require('./Routes/Owner.Routes.js')
const ProductRoutes=require('./Routes/product.route.js')
const cors=require('cors')


const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", //admin panel
    origin: "http://localhost:5174", //user panel
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    
}));
ConnectToDb()
app.get('/',(req,res)=>{
    res.send("hello world");
})

app.use('/buyer',BuyerRoutes)
app.use('/Cart',CartRoutes)
app.use('/owner',OwnerRoutes)
app.use('/product',ProductRoutes)
module.exports=app