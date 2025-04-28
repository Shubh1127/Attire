const BuyerModel = require('../Model/BuyerModel');
const jwt = require('jsonwebtoken');
const ProductModel = require('../Model/ProductModel');
const CartModel=require('../Model/CartModel');

module.exports.addToCart = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Please login first' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyerId = decoded._id;

    const { productId, quantity, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({ message: 'Product ID, size, and color are required' });
    }

    const quantityToAdd = quantity ? quantity : 1;

    // Find the cart for the buyer
    let cart = await CartModel.findOne({ userId: buyerId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new CartModel({ userId: buyerId, items: [] });
    }

    // Check if the item with the same productId, size, and color already exists in the cart
    const cartItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (cartItemIndex !== -1) {
      // If the item exists, update the quantity
      cart.items[cartItemIndex].quantity += quantityToAdd;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.items.push({ productId, quantity: quantityToAdd, size, color });
    }

    await cart.save();

    // Update the buyer's cart field
    const buyer = await BuyerModel.findById(buyerId);
    buyer.cart = cart.items;
    await buyer.save();

    res.status(200).json({ message: 'Item added to cart successfully', cart: cart.items });
  } catch (err) {
    console.error(err);
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
    const buyerId = decoded._id;

    // Find the cart for the buyer
    const cart = await CartModel.findOne({ userId: buyerId }).populate({
      path: 'items.productId',
      model: 'Product',
      select: 'name price photo description',
    });

    if (!cart) {
      return res.status(200).json({ cart: [] }); // Return an empty cart if none exists
    }

    // Update the buyer's cart field
    const buyer = await BuyerModel.findById(buyerId);
    buyer.cart = cart.items;
    await buyer.save();

    const cartDetails = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      photo: item.productId.photo,
      description: item.productId.description,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
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
    const buyerId = decoded._id;

    const cart = await CartModel.findOne({ userId: buyerId });
    if (!cart) {
      return res.status(400).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find((item) => item.productId.toString() === productId);
    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      return res.status(400).json({ message: 'Product not found in cart' });
    }

    await cart.save();

    // Update the buyer's cart field
    const buyer = await BuyerModel.findById(buyerId);
    buyer.cart = cart.items;
    await buyer.save();

    return res.status(200).json({ message: 'Cart updated successfully', cart: cart.items });
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
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyerId = decoded._id;

    const cart = await CartModel.findOne({ userId: buyerId });
    if (!cart) {
      return res.status(400).json({ message: 'Cart not found' });
    }

    const cartItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (cartItemIndex !== -1) {
      cart.items.splice(cartItemIndex, 1);
    } else {
      return res.status(400).json({ message: 'Product not found in cart' });
    }

    await cart.save();

    // Update the buyer's cart field
    const buyer = await BuyerModel.findById(buyerId);
    buyer.cart = cart.items;
    await buyer.save();

    return res.status(200).json({ message: 'Item removed from cart successfully', cart: cart.items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};