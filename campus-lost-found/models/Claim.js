const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  foundItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem', required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  reason: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

claimSchema.index({ foundItemId: 1, claimedBy: 1 }, { unique: true });

module.exports = mongoose.model('Claim', claimSchema);
