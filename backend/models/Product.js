const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Books', 'Notes', 'Stationery', 'Electronics', 'Other']
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair'],
    default: 'Good'
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Product+Image'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  // Future: Blockchain integration placeholder
  // blockchainTxHash: String,
  // Future: IoT inventory tracking placeholder
  // iotDeviceId: String,
  // iotLastSync: Date
}, { timestamps: true });

// Index for search optimization
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
