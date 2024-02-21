const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  profilePhoto: {
    type: String,
    required: true
  },

  deleted: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
