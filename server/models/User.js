const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  position: {
    type: Number,
    default: 0
  },
  preferredPackage: {
    type: String,
    enum: ['starter', 'elite', 'pro'],
    default: 'elite'
  },
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teamSide: {
    type: String,
    enum: ['left', 'right', 'none'],
    default: 'none'
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  paymentInfoSubmitted: {
    type: Boolean,
    default: false
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  referralCode: {
    type: String,
    unique: true
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  metadata: {
    lastLogin: Date,
    browser: String,
    ipAddress: String
  },
  achievements: [{
    name: String,
    earnedDate: Date,
    description: String
  }]
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate referral code before saving
UserSchema.pre('save', function(next) {
  if (!this.referralCode) {
    // Generate a unique referral code using firstName, lastName, and a random string
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referralCode = `${this.firstName.substring(0, 2)}${this.lastName.substring(0, 2)}-${randomString}`;
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);