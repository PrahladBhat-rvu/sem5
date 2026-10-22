const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, enum: ['Electronics', 'ID / Cards', 'Books & Stationery', 'Clothing', 'Keys', 'Bags', 'Water Bottles', 'Accessories', 'Other'] },
  description: { type: String, required: true, trim: true, minlength: 5, maxlength: 1000 },
  lastSeenLocation: { type: String, required: true, trim: true, maxlength: 200 },
  dateLost: { type: Date, required: true },
  status: { type: String, enum: ['Lost', 'Found'], default: 'Lost' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
