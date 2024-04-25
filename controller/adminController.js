const Product = require('../model/ProductModel');
const Admin = require('../model/AdminModel');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const storage = require('node-persist');
storage.init();


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sahildesai4050@gmail.com',
        pass: 'daqf vpoy yeyb hylj'
    }
});



exports.AdminSignUp = async (req, res) => {
    var admin_Status = await storage.getItem("AdminId");
    if (admin_Status) {
        res.status(200).json({
            message: "Someone Already Logged In",
            Admin_Id: admin_Status
        })
    } else {
        let { name, email, password } = req.body;
        let existing = await Admin.findOne({ email });
        console.log(existing);
        if (existing) {
            return res.status(201).json({
                message: "Admin already exist"
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            password = hashedPassword;
            const admin = new Admin({ name, email, password });
            await admin.save();
            var mailOptions = {
                from: 'sahildesai4050@gmail.com',
                to: email,
                subject: 'Greeting New Admin',
                text: 'welcome to My Todo List By Sahil desai, from Now You Are The Admin...! '
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(201).json({
                message: "Admin login successfully",
                admin: admin
            });
        }
    }
}

exports.AdminLogin = async (req, res) => {  
    var admin_Status = await storage.getItem("AdminId");
    console.log(admin_Status);
    if (admin_Status) {
        res.status(200).json({
            message: "Someone Already Logged In",
            Admin_Id: admin_Status
        })
    } else {
        let { email, password } = req.body;
        let existing = await Admin.findOne({ email });
        if (existing) {
            console.log(existing);
            const isMatch = await bcrypt.compare(password, existing.password);
            if (isMatch) {
                storage.setItem('AdminId', existing.id);
                res.status(201).json({
                    message: "Admin login successfully",
                    admin: existing
                });
            } else {
                res.status(201).json({
                    message: "Password is incorrect"
                });
            }
        } else {
            res.status(201).json({
                message: "Admin does not exist"
            });
        }
    }
}

exports.AdminLogout = async (req, res) => {
    await storage.removeItem('AdminId');
    res.status(201).json({
        message: "Admin logout successfully"
    });
}
exports.AdminDashboard = async (req, res) => {
    let AdminId = await storage.getItem('AdminId');
    if (AdminId) {
        let {title,description,price,rating,stock,brand,category}= req.body;
        var existing = await Product.findOne({title});
        if(existing){
            return res.status(201).json({
                message: "Product already exist"
            });
        }else{
            let image = req.file.filename;
            const product = new Product({title,description,price,rating,stock,brand,category,thumbnail:image});
            await product.save();
            res.status(201).json({
                message: ` ${title} added successfully`,
                product: product
            });
        }
    } else {
        res.status(200).json({
            message: "You are Not Logged In",
        })
    }
}

exports.updateProduct = async (req,res)=>{
    let AdminId = await storage.getItem('AdminId');
    if(AdminId){
        let name = req.params.id;
        var existing = await Product.findOne({title:name});
        if(existing){
            let {title,description,price,rating,stock,brand,category}= req.body;
            let image = req.file.filename;
            await Product.updateOne({title},{$set:{title,description,price,rating,stock,brand,category,thumbnail:image}});
            res.status(201).json({
                message: ` ${title} updated successfully`,
            });
        }else{
            res.status(201).json({
                message: `${title} does not exist`
            });
        }
    }else{
        res.status(200).json({
            message: "You are Not Logged In",
        })
    }
}

exports.deleteProduct = async (req,res)=>{
    let AdminId = await storage.getItem('AdminId');
    if(AdminId){
        let title= req.params.id;
        console.log(title);
        var existing = await Product.findOne({title});
        if(existing){
            await Product.deleteOne({title});
            res.status(201).json({
                message: ` ${title} deleted successfully`,
            });
        }else{
            res.status(201).json({
                message: "Product does not exist"
            });
        }
    }else{
        res.status(200).json({
            message: "You are Not Logged In",
        })
    }
}