const mongoose = require("mongoose"),
    Schema = mongoose.Schema

const chefSchema = new Schema({
    
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

const Chef = mongoose.model("chef", chefSchema);


module.exports = Chef;