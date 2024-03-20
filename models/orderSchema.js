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
    },
    quantity: {
      type: Number,
      required: true
    },
    paid: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number
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
  chefStatus:{
    type: String,
    enum: [ 'delivered', 'cancelled']
  },
 
  supplierStatus: {
    type: String,
    enum: ['ready_to_payment', 'served', 'cancelled', 'pending']
},
  totalPrice: {
    type: Number
  },
  tableStatus:{
    type: Boolean,
    default: false
   
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
