const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    minlength: 6,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['student', 'provider', 'admin'],
    default: 'student',
  },
  orgName: {
    type: String,
    trim: true,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationOTP: String,
  verificationOTPExpires: Date,
  resetToken: String,
  resetTokenExpiry: Date,
  refreshToken: String,
  lastLogin: Date,
  notifications: {
    newMatches: { type: Boolean, default: true },
    applicationUpdates: { type: Boolean, default: true },
    deadlines: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.verificationOTP;
  delete obj.verificationOTPExpires;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
