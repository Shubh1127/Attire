const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  size: String,
  color: String,
  photo: String,
  productSnapshot: Object // Stores product details at time of purchase
});

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const paymentDetailsSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['card', 'cod'],
    required: true
  },
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  payment: paymentDetailsSchema,
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  trackingNumber:String,
  expectedDeliveryDate: {
    type: Date,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7); // Default to 7 days from now
      return date;
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});
orderSchema.index({ createdAt: 1 }, { status: 1}); 
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;