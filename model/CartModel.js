const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;