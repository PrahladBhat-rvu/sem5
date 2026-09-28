const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = mongoose.model("User", userSchema);