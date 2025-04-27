const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addressSchema = new mongoose.Schema({
  houseNo: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  isDefault: { type: Boolean, default: false },
});

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String
},
  phoneNumber: { type: Number },
  profileImageUrl: { type: String, default: "" },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  addresses: { type: [addressSchema], default: [] },
  orders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Orders", default: [] },
  ],
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

buyerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

buyerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

buyerSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const BuyerModel = mongoose.model("Buyer", buyerSchema);

module.exports = BuyerModel;
