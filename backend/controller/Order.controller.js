const razorpay = require("razorpay"); // Make sure you have razorpay installed
const Order = require("../Model/OrderModel");
const Product = require("../Model/ProductModel");
const Buyer = require("../Model/BuyerModel");
const mongoose = require("mongoose");
const CartModel = require("../Model/CartModel"); // Assuming you have a Cart model
// Create a new order
const createOrder = async (req, res) => {
  try {
    const buyerId = req.user._id; // Assuming you have buyer ID from the authenticated user
    const { items, shippingAddressId, paymentMethod } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping address ID",
      });
    }

    // Fetch buyer with the specific address
    const buyer = await Buyer.findOne(
      {
        _id: buyerId,
        "addresses._id": shippingAddressId,
      },
      {
        name: 1,
        phoneNumber: 1,
        "addresses.$": 1,
      }
    );

    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: "Buyer or address not found",
      });
    }

    const shippingAddress = buyer.addresses[0];

    // Calculate order totals
    let subtotal = 0;
    const products = await Product.find({
      _id: { $in: items.map((item) => item.product_id) },
    });

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.equals(item.product_id));
      if (!product) throw new Error(`Product ${item.product_id} not found`);

      const itemTotal = item.quantity * product.price;
      subtotal += itemTotal;

      return {
        product_id: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color,
        photo: product.photo[0],
        productSnapshot: product.toObject(),
      };
    });

    const shippingCost = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;
    const total = subtotal + shippingCost + tax;

    // Create shipping address object
    const orderShippingAddress = {
      name: buyer.name,
      phone: buyer.phoneNumber,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      country: shippingAddress.country || "India",
      isDefault: shippingAddress.isDefault,
    };

    // Create payment details
    const paymentDetails = {
      method: paymentMethod,
      amount: total,
      status: paymentMethod === "cod" ? "completed" : "pending",
    };

    // Create new order
    const newOrder = new Order({
      buyer_id: buyerId,
      items: orderItems,
      shippingAddress: orderShippingAddress,
      payment: paymentDetails,
      subtotal,
      shippingCost,
      tax,
      total,
      status: paymentMethod === "cod" ? "confirmed" : "pending",
    });

    // Start transaction to ensure both operations succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Save the order
      await newOrder.save({ session });

      // Update buyer's orders array
      await Buyer.findByIdAndUpdate(
        buyerId,
        { $push: { orders: newOrder._id } },
        { session, new: true }
      );

      // Update product stock
      await Promise.all(
        items.map(async (item) => {
          await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: -item.quantity } },
            { session }
          );
        })
      );

      // Commit the transaction
      await session.commitTransaction();

      res.status(201).json({
        success: true,
        order: newOrder,
        message: "Order created successfully",
      });
    } catch (error) {
      // If any operation fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};
const initiateRazorpayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Validate orderId
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Fetch the order from database
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Create Razorpay instance with your API keys
    const instance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order (with await)
    const razorpayOrder = await instance.orders.create({
      amount: Math.round(order.total * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `order_${order._id}`,
      payment_capture: 1, // Auto-capture payment
    });

    // Save Razorpay order ID to your order
    order.payment.razorpay_order_id = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error initiating Razorpay payment:", error);
    res.status(500).json({
      success: false,
      message: "Error initiating Razorpay payment",
      error: error.message,
    });
  }
};
// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const ownerId = req.params.ownerId; // Assuming ownerId is passed as a route parameter

    // First, find all product IDs that belong to this owner
    const ownerProducts = await ProductModel.find({ OwnerId: ownerId }, '_id');
    const ownerProductIds = ownerProducts.map(product => product._id);

    // Build the query to find orders that contain these products
    const query = {
      'items.product_id': { $in: ownerProductIds }
    };
    
    if (status) {
      query.status = status;
    }

    // Find orders with pagination
    const orders = await Order.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('buyer_id', 'name email') // Optional: populate buyer info
      .populate('items.product_id', 'name photo'); // Optional: populate product info

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};
// Get orders for a specific buyer
const getBuyerOrders = async (req, res) => {
  try {
    const { buyer_id } = req.params;
    const { status } = req.query;
    const query = { buyer_id };
    if (status) query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching buyer orders",
      error: error.message,
    });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "buyer_id",
      "name email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updateFields = { status };
    if (status === "shipped") {
      updateFields.trackingNumber = trackingNumber;
      updateFields.carrier = carrier;
      updateFields.estimatedDelivery = new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ); // 3 days from now
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // TODO: Send status update notification to buyer

    res.status(200).json({
      success: true,
      order: updatedOrder,
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Cancel order (buyer)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow cancellation if order hasn't shipped yet
    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled as it has already been shipped",
      });
    }

    order.status = "cancelled";
    order.notes = reason || "Buyer requested cancellation";
    await order.save();

    // If payment was made, initiate refund
    if (order.payment.status === "completed") {
      // TODO: Implement refund logic
    }

    // Restore product stock
    await Promise.all(
      order.items.map(async (item) => {
        await Product.updateOne(
          { _id: item.product_id },
          { $inc: { stock: item.quantity } }
        );
      })
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// Process Razorpay payment success
const processPaymentSuccess = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Verify payment (you should implement proper verification)
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "payment.razorpay_payment_id": razorpay_payment_id,
          "payment.razorpay_order_id": razorpay_order_id,
          "payment.razorpay_signature": razorpay_signature,
          "payment.status": "completed",
          status: "confirmed",
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const result = await CartModel.findOneAndDelete({ userId: order.buyer_id });


    res.status(200).json({
      success: true,
      order,
      message: "Payment processed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
};

// Get sales analytics (admin)
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    let groupBy, dateFormat;

    switch (period) {
      case "day":
        groupBy = { $dayOfMonth: "$createdAt" };
        dateFormat = "%Y-%m-%d";
        break;
      case "week":
        groupBy = { $week: "$createdAt" };
        dateFormat = "%Y-%W";
        break;
      case "month":
      default:
        groupBy = { $month: "$createdAt" };
        dateFormat = "%Y-%m";
        break;
      case "year":
        groupBy = { $year: "$createdAt" };
        dateFormat = "%Y";
        break;
    }

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            date: groupBy,
            year: { $year: "$createdAt" },
          },
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: "$total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.date": 1 } },
    ]);

    res.status(200).json({
      success: true,
      period,
      salesData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sales analytics",
      error: error.message,
    });
  }
};


const fetchAllBuyersWithOrders = async (req, res) => {
  try {
    const buyersWithOrders = await Order.aggregate([
      // Group orders by buyer_id and calculate total amount spent and last order date
      {
        $group: {
          _id: "$buyer_id",
          totalSpent: { $sum: "$total" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
      // Lookup buyer details from the Buyer collection
      {
        $lookup: {
          from: "buyers", // Collection name in MongoDB (plural of Buyer model)
          localField: "_id",
          foreignField: "_id",
          as: "buyerDetails",
        },
      },
      // Unwind the buyerDetails array
      {
        $unwind: "$buyerDetails",
      },
      // Project the required fields
      {
        $project: {
          _id: 0,
          buyerId: "$buyerDetails._id",
          name: "$buyerDetails.name",
          email: "$buyerDetails.email",
          phone: "$buyerDetails.phoneNumber",
          photoUrl: "$buyerDetails.profileImageUrl",
          totalSpent: 1,
          lastOrderDate: 1,
        },
      },
      // Sort by last order date in descending order
      {
        $sort: { lastOrderDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      buyers: buyersWithOrders,
    });
  } catch (error) {
    console.error("Error fetching buyers with orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching buyers with orders",
      error: error.message,
    });
  }
};

module.exports.deleteExpiredOrders = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find and delete orders with status 'pending' older than 24 hours
    const result = await Order.deleteMany({
      status: 'pending',
      createdAt: { $lt: twentyFourHoursAgo },
    });

    // console.log(`${result.deletedCount} expired orders deleted.`);
  } catch (error) {
    console.error('Error deleting expired orders:', error.message);
  }
};

module.exports = {
  fetchAllBuyersWithOrders,
  createOrder,
  getAllOrders,
  getBuyerOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  processPaymentSuccess,
  getSalesAnalytics,
  initiateRazorpayPayment,
};
