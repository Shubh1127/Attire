const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      size: {
        type: String, // Store the selected size
        required: true,
      },
      color: {
        type: String, // Store the selected color
        required: true,
      },
    },
  ],
});

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;