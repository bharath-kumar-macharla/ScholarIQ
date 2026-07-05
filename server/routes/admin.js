const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');

// Middleware to ensure route is accessed by an admin
router.use(auth, authorize('admin'));

// GET /api/admin/dashboard
// Get platform-wide stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const providers = await User.countDocuments({ role: 'provider' });
    
    const activeScholarships = await Scholarship.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();

    // Sum of all active scholarship amounts
    const scholarships = await Scholarship.find({ status: 'active' });
    const totalFunding = scholarships.reduce((acc, curr) => acc + curr.amount, 0);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

    res.json({
      totalUsers,
      students,
      providers,
      activeScholarships,
      totalApplications,
      totalFunding,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve admin stats' });
  }
});

// GET /api/admin/users
// Get all users with filtering
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query).sort({ createdAt: -1 }).select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// DELETE /api/admin/users/:id
// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    // Basic protection against deleting oneself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Ideally we should also cascade delete profiles, scholarships, and applications here
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET /api/admin/scholarships
// Get all scholarships regardless of status
router.get('/scholarships', async (req, res) => {
  try {
    const scholarships = await Scholarship.find().populate('providerId', 'name email').sort({ createdAt: -1 });
    res.json({ scholarships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scholarships' });
  }
});

// PUT /api/admin/scholarships/:id/approve
// Approve or reject a scholarship for the platform
router.put('/scholarships/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id, 
      { isApproved },
      { new: true }
    );
    
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });
    
    res.json({ message: `Scholarship ${isApproved ? 'approved' : 'rejected'}`, scholarship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update scholarship approval' });
  }
});

// DELETE /api/admin/scholarships/:id
// Delete a scholarship
router.delete('/scholarships/:id', async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ scholarshipId: req.params.id });
    
    res.json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete scholarship' });
  }
});

module.exports = router;
