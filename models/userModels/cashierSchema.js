const mongoose = require("mongoose"),
    Schema = mongoose.Schema

const cashierSchema = new Schema({
    
    image: {
        type: String,
      },
      
    name: {
        type: String
    },

    password: {

        type: String
    },

    email: {
        type: String
    },
    gender: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    userType: {
        type: String
    },
    experience: {
        type: String
    },
    tokens: [{
        type: String
    }],
    deleted: {
        type: Boolean
    }
}, { timestamps: true })

const Cashier = mongoose.model("cashier", cashierSchema);


module.exports = Cashier;