const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'blockchain'], // Future: blockchain payment
    default: 'cash'
  },
  // Future: Blockchain payment integration
  // blockchainTxHash: String,
  // blockchainNetwork: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
