const BuyerModel = require('../Model/BuyerModel');
const jwt = require('jsonwebtoken');
const ProductModel = require('../Model/ProductModel');
const cartmodel=require('../Model/CartModel');
module.exports.addToCart = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const quantityToAdd = quantity ? quantity : 1;
    const cartItemIndex = buyer.cart.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (cartItemIndex !== -1) {
      buyer.cart[cartItemIndex].quantity += quantityToAdd;
    } else {
      buyer.cart.push({ productId, quantity: quantityToAdd });
    }
    await buyer.save();
    res.status(200).json({ message: 'Item added to cart successfully', cart: buyer.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports.getCart = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id).populate({
      path: 'cart.productId',
      model: 'Product',
      select: 'name price photo description farmerId' 
    });
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }
    // console.log(buyer.cart)

    const cartDetails = buyer.cart.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      photo: item.productId.photo,
      description: item.productId.description,
      quantity: item.quantity,
      farmerId: item.productId.farmerId
    }));
    return res.status(200).json({ cart: cartDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
module.exports.updateCart = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const { productId, quantity } = req.body; 
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'ProductId and quantity are required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }
    const cartItem = buyer.cart.find(item => item.productId.toString() === productId);
    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      buyer.cart.push({ productId, quantity });
    }

    // Save the updated buyer's cart
    await buyer.save();
    return res.status(200).json({ message: 'Cart updated successfully', cart: buyer.cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
module.exports.deleteCart = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }
  try {
    const { productId } = req.body;
    // Expect productId in the request body
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await BuyerModel.findById(decoded._id);

    if (!buyer) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    // Find the item in the cart
    const cartItemIndex = buyer.cart.findIndex(item => item.productId.toString() === productId);

    if (cartItemIndex !== -1) {
      if (buyer.cart[cartItemIndex].quantity > 1) {
        // Reduce the quantity by one
        buyer.cart[cartItemIndex].quantity -= 1;
      } else {
        // Remove the item from the cart if the quantity is one
        buyer.cart.splice(cartItemIndex, 1);
      }
    } else {
      return res.status(400).json({ message: 'Product not found in cart' });
    }

    // Save the updated buyer's cart
    await buyer.save();
    return res.status(200).json({ message: 'Item updated in cart successfully', cart: buyer.cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};