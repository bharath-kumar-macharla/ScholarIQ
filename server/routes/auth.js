const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateVerificationToken } = require('../utils/jwt');
const { auth } = require('../middleware/auth');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../services/emailService');

// POST /api/auth/register — Student registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      verificationOTP: otp,
      verificationOTPExpires: new Date(Date.now() + 15 * 60 * 1000), // 15m
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(email, name, otp);

    res.status(201).json({
      message: 'Registration successful. Please check your email for the 6-digit OTP code to verify your account.',
      email: user.email,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/register/provider — Provider registration
router.post('/register/provider', async (req, res) => {
  try {
    const { name, email, password, orgName } = req.body;

    if (!name || !email || !password || !orgName) {
      return res.status(400).json({ error: 'Name, email, password, and organization name are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      name,
      email,
      password,
      role: 'provider',
      verificationOTP: otp,
      verificationOTPExpires: new Date(Date.now() + 15 * 60 * 1000), // 15m
    });

    sendVerificationEmail(email, name, otp);

    res.status(201).json({
      message: 'Provider registration successful. Please check your email for the 6-digit OTP code to verify your account.',
      email: user.email,
    });
  } catch (error) {
    console.error('Provider register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login — Email + password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      // Trigger a new OTP send if expired or missing
      if (!user.verificationOTP || new Date() > user.verificationOTPExpires) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOTP = otp;
        user.verificationOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        sendVerificationEmail(user.email, user.name, otp);
      }
      return res.status(403).json({ 
        error: 'Please verify your email address before logging in. A verification OTP has been sent to your email.', 
        email: user.email,
        requiresVerification: true
      });
    }

    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google sign-in. Please login with Google.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful.',
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// POST /api/auth/google — Google OAuth login/register
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar, role } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({ error: 'Google profile data is required.' });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Existing user — link Google account if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || avatar;
      }
      user.lastLogin = new Date();
    } else {
      // New user
      user = new User({
        name,
        email,
        googleId,
        avatar,
        role: role || 'student',
        isVerified: true, // Google accounts are pre-verified
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Google login successful.',
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed.' });
  }
});

// POST /api/auth/verify-otp — Verify email using 6-digit OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Account is already verified.' });
    }

    if (user.verificationOTP !== otp || new Date() > user.verificationOTPExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// POST /api/auth/resend-otp — Resend 6-digit OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Account is already verified.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.verificationOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    sendVerificationEmail(email, user.name, otp);

    res.json({ message: 'A new 6-digit OTP has been sent to your email.' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    }

    const resetToken = generateVerificationToken();
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    sendResetPasswordEmail(email, user.name, resetToken);

    res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link.' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed.' });
  }
});

// GET /api/auth/me — Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// POST /api/auth/refresh — Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token.' });
  }
});

// POST /api/auth/logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed.' });
  }
});

module.exports = router;
