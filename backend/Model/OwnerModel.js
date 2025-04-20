const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Define the Owner schema
const OwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    profileImage: { // Add profileImage field
        type: String,
        default: 'https://via.placeholder.com/150' // Default placeholder image
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

OwnerSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

OwnerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

OwnerSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const OwnerModel = mongoose.model('Owner', OwnerSchema);
module.exports = OwnerModel;
