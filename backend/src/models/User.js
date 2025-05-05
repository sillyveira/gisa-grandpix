const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true
  },
  equipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
