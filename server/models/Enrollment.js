const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  package: {
    type: String,
    enum: ['starter', 'elite', 'pro'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'cancelled', 'completed'],
    default: 'pending'
  },
  position: {
    type: Number,
    required: true
  },
  teamSide: {
    type: String,
    enum: ['left', 'right', 'none'],
    default: 'none'
  },
  paymentDetails: {
    cardLast4: String,
    paymentMethod: String,
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
    paymentCollectedAt: Date
  },
  formCompletedAt: {
    type: Date,
    default: Date.now
  },
  sharingStats: {
    websiteVisits: {
      type: Number,
      default: 0
    },
    referralsSignedUp: {
      type: Number,
      default: 0
    },
    emailsSent: {
      type: Number,
      default: 0
    },
    socialShares: {
      type: Number,
      default: 0
    }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);