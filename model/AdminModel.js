var mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    }
})

module.exports = mongoose.model('admin', AdminSchema);