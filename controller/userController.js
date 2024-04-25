const User = require('../model/userModel');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const storage = require('node-persist');
const Cart = require('../model/CartModel');
var Product = require('../model/ProductModel')
storage.init();

exports.getData = async (req, res) => {
    let data = await Product.find();
    res.status(200).json({
        data: data,
        message: "Data fetched successfully"
    });
}

exports.getCategory = async (req, res) => {
    let id = req.params.id;
    let data = await Product.find({ category: id });
    if (data.length > 0) {
        res.status(200).json({
            category: `All ${id} Products are Under`,
            data: data,
            message: "Data fetched successfully"
        });
    } else {
        res.status(201).json({
            message: "Category does not exist"
        });
    }
}

exports.searchProduct = async (req, res) => {
    let name = req.query.name || "";
    let productName = await Product.find({ title: name });
    let cateName = await Product.find({ category: name });
    let barndName = await Product.find({ brand: name });

    var sendData = (data) => {
        res.status(200).json({
            products: `All ${name} results are Under`,
            data: data,
            message: "Data fetched successfully"
        });
    }
    if (productName.length > 0) {
        sendData(productName);
    } else if (cateName.length > 0) {
        sendData(cateName);
    } else if (barndName.length > 0) {
        sendData(barndName);
    } else {
        res.status(201).json({
            message: "Product does not exist"
        });
    }
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sahildesai4050@gmail.com',
        pass: 'daqf vpoy yeyb hylj'
    }
});



exports.userSignUp = async (req, res) => {
    let { name, email, password } = req.body;
    let existing = await User.findOne({ email });
    console.log(existing);
    if (existing) {
        return res.status(201).json({
            message: "Employee already exist"
        });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        password = hashedPassword;
        const user = new User({ name, email, password });
        await user.save();
        var mailOptions = {
            from: 'sahildesai4050@gmail.com',
            to: email,
            subject: 'Greeting New employee',
            text: 'welcome to My Todo List By Sahil desai, from Now You Are The Future...! '
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(201).json({
            message: "Employee login successfully",
            user: user
        });
    }
}

exports.userLogin = async (req, res) => {
    let { email, password } = req.body;
    let existing = await User.findOne({ email });
    if (existing) {
        console.log(existing);
        const isMatch = await bcrypt.compare(password, existing.password);
        if (isMatch) {
            storage.setItem('userId', existing.id);
            res.status(201).json({
                message: "Employee login successfully",
                user: existing
            });
        } else {
            res.status(201).json({
                message: "Password is incorrect"
            });
        }
    } else {
        res.status(201).json({
            message: "Employee does not exist"
        });
    }
}

exports.userLogout = async (req, res) => {
    storage.removeItem('userId');
    res.status(201).json({
        message: "Employee logout successfully"
    });
}
exports.userDashboard = async (req, res) => {
    let userId = await storage.getItem('userId');
    console.log(userId);
    if (userId) {
        res.status(200).json({
            message: "Your Employess Data is Here",
            User_Id: userId
        })
    } else {
        res.status(200).json({
            message: "You are Not Logged In",
        })
    }
}

// exports.cart = async (req, res) => {
//     let userId = await storage.getItem('userId');
//     if (userId) {
//         const { productId, quantity } = req.body;
//         const cartItem = await Cart({product: productId, quantity: quantity});
//         let user = await User.findById(userId);
//         user.cart.push(cartItem);
//         await user.save();
//         res.status(200).json({
//             message: "Product Added To Cart",
//             cart: user.cart
//         })
//     } else {
//         res.status(200).json({
//             message: "You are Not Logged In",
//         })
//     }
// }
