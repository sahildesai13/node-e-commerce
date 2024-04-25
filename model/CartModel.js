const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: String },
    product: { type: Array  },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;