const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table', 
    required: true
  },
  items: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish', 
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    paid: {
      type: Boolean,
      default: false
  }
  }],
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier', 
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  chefUpdates: [{
    status: {
      type: String,
      enum: ['pending',  'served','cancelled'],
      
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalPrice:{
    type:Number
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
