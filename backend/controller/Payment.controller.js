// Payment Controller
const razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: req.body.receipt,
      notes: req.body.notes,
    };
    
    const order = await instance.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature === razorpay_signature) {
      // Payment is successful, create order in your database
      // ...
      res.json({ success: true });
    } else {
      throw new Error('Invalid signature');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};