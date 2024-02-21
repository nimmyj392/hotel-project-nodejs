const mongoose = require("mongoose"),
    Schema = mongoose.Schema

const supplierSchema = new Schema({
    
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

const Supplier = mongoose.model("supplier", supplierSchema);


module.exports = Supplier;