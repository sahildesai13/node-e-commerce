const Cart = require('../model/CartModel');
const User = require('../model/userModel');
const storage = require('node-persist');

storage.init();

exports.addToCart = async (req, res) => {
    let userId = storage.getItem('userId');
    if(userId){
        let productId = req.params.id;
        let existing = await Cart.findOne({userId,productId});
        if(existing){
            existing.quantity = existing.quantity + 1;
            await existing.save();
            res.status(201).json({
                message: "Product added to cart successfully",
                cart: existing
            });
        }else{
            let cart = new Cart({ userId, productId, quantity: 1 });
            await cart.save();
            res.status(201).json({
                message: "Product added to cart successfully",
                cart: cart
            });
        }
    }
}