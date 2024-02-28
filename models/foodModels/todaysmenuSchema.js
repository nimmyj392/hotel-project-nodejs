const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todaysMenuSchema = new Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        
    },
  
    category: {
        type: String,
        
    },
    startTime: {
        type: String,
    },
    stock: {
        type: Number,
        
    },
    endTime: {
        type: String,
        
    },
    preparedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chef',
    
    },
    deleted: {
        type: Boolean,
        default: false
    },
    price: {
        type: String,

    },
    name: {
        type: String,
        
    },
    description: {
        type: String,
        
    }
}, { timestamps: true });

const Menu = mongoose.model("menu", todaysMenuSchema);

module.exports = Menu;
