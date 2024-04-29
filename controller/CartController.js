const Cart = require('../model/CartModel');
const User = require('../model/userModel');
const Product = require('../model/ProductModel')
const storage = require('node-persist');

storage.init();

exports.addToCart = async (req, res) => {
    let userId = await storage.getItem('userId');
    let productId = req.params.id;
    if (userId) {
        let existing = await Cart.findOne({ userId, "product.productId": productId });
        if (existing) {
            await Cart.findOneAndUpdate({ userId, "product.productId": productId }, { $inc: { "product.$.quantity": 1 } }, { new: true });
            let cartData = await Cart.findOne({ userId, "product.productId": productId })
            res.status(200).json({
                message: "data",
                cart: cartData
            })
        }
        else {
            let DataProduct = await Product.findById(productId);
            console.log(DataProduct);
            if (DataProduct) {
                let user = await Cart.findOne({ userId });
                if (user) {
                    await Cart.updateOne({ userId }, { $push: { product: { productId: productId, products: DataProduct, quantity: 1 } } });
                    let updatedCart = await Cart.findOne({ userId });
                    res.status(201).json({
                        message: "Product added to cart successfully",
                        cart: updatedCart
                    });
                } else {
                    let cart = new Cart({ userId, product: [] });
                    cart.product.push({ productId: productId, products: DataProduct, quantity: 1 });
                    await cart.save();
                    res.status(201).json({
                        message: "Product added to cart successfully",
                        cart: cart
                    });
                }
            } else {
                res.status(200).json({
                    message: "Product Not Found"
                })
            }
        }
    } else {
        res.status(200).json({
            message: "You Are Not Logged In"
        })
    }
}
exports.updateCart = async (req, res) => {
    let userId = await storage.getItem('userId');
    let productId = req.params.id;
    let quantity = req.body.quantity;
    if (userId) {
        let existing = await Cart.findOne({ userId, "product.productId": productId });
        if (existing) {
            if (quantity == 0) {
                let data =  existing.product.filter((ele,ind)=>{
                    if(ele.productId == productId){
                        return 0;
                    }else{
                        return 1;
                    }
                })
                await Cart.findByIdAndUpdate(existing.id,{product:data})          
                res.status(200).json({
                    message: "Product Deleted From Cart"
                })
            } else {
                await Cart.findOneAndUpdate({ userId, "product.productId": productId }, { $set: { "product.$.quantity": quantity } }, { new: true });
                let cartData = await Cart.findOne({ userId, "product.productId": productId })
                res.status(200).json({
                    message: "data",
                    cart: cartData
                })
            }
        } else {
            res.status(200).json({
                message: "Product Not Found In Cart"
            })
        }
    } else {
        res.status(200).json({
            message: "You Are Not Logged In",
        })
    }
}

exports.deleteItem = async (req,res)=>{
    let userId = await storage.getItem('userId');
    let productId = req.params.id;
    if(userId){
        let existing = await Cart.findOne({ userId, "product.productId": productId });
        if(existing){
            let data =  existing.product.filter((ele)=>{
                if(ele.productId == productId){
                    return 0;
                }else{
                    return 1;
                }
            })
            await Cart.findByIdAndUpdate(existing.id,{product:data})          
            res.status(200).json({
                message: "Product Deleted From Cart"
            })
        }else{
            res.status(200).json({
                message: "Product Not Found In Cart"
            })
        }
    }else{
        res.status(200).json({
            message: "You Are Not Logged In",
        })
    }
}

exports.DeleteCart = async (req,res)=>{
    let userId = await storage.getItem('userId');
    if(userId){
        let existing = await Cart.findOne({userId});
        if(existing){
            await Cart.findByIdAndDelete(existing.id)
            res.status(200).json({
                message: "Cart Deleted"
            })
        }else{
            res.status(200).json({
                message: "Product Not Found In Cart"
            })
        }
        
    }else{
        res.status(200).json({
            message: "You Are Not Logged In",
        })
    }
}

exports.GetCart = async (req,res)=>{
    let userId = await storage.getItem('userId');
    if(userId){
        let existing = await Cart.findOne({userId});
        if(existing){
           res.status(200).json({
            message:"All Cart Prodcut is Below",
            cart: existing.product
           })
        }else{
            res.status(200).json({
                message: "Product Not Found In Cart"
            })
        }
    }else{
        res.status(200).json({
            message: "You Are Not Logged In",
        })
    }
}