const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  aadhaar: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, sparse: true }, // For email notifications
  fcmToken: { type: String }, // For push notifications
  role: { type: String, enum: ['herder', 'admin'], default: 'herder' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
