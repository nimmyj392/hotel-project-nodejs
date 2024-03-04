const mongoose = require("mongoose"),
    Schema = mongoose.Schema

const foodSchema = new Schema({

    name: {
        type: String
    },

    description: {

        type: String
    },
    category: {

        type: String
    },
    price: {
        type: Number,
        default: null
    },
    image: {
        type: String,
      },
    preparedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chef'
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Dish = mongoose.model("dish", foodSchema);

module.exports = Dish;