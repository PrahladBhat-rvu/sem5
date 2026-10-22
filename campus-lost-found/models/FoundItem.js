const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, enum: ['Electronics', 'ID / Cards', 'Books & Stationery', 'Clothing', 'Keys', 'Bags', 'Water Bottles', 'Accessories', 'Other'] },
  description: { type: String, required: true, trim: true, minlength: 5, maxlength: 1000 },
  foundLocation: { type: String, required: true, trim: true, maxlength: 200 },
  dateFound: { type: Date, required: true },
  status: { type: String, enum: ['Available', 'Returned'], default: 'Available' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);
