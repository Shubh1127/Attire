const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length >= 1; // At least 1 photo is required
            },
            message: 'At least 1 photo is required.'
        }
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainCategory: {
        type: String,
        required: true,
        enum: ['men', 'women', 'kids'], // Changed to lowercase to match frontend
    },
    category: {
        type: String,
        required: true
    },
    sizes: {
        type: [String],
        default: [],
        enum: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'one-size']
    },
    colors: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Regular', 'New Arrival', 'On Sale'],
        default: 'Regular'
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    OwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;