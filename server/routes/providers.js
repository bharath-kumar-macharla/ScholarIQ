const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// Middleware to ensure route is accessed by a provider
router.use(auth, authorize('provider'));

// GET /api/providers/dashboard
// Get provider dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const providerId = req.user.id;

    const scholarships = await Scholarship.find({ providerId });
    const scholarshipIds = scholarships.map(s => s._id);

    const applications = await Application.find({ scholarshipId: { $in: scholarshipIds } });

    res.json({
      activeScholarships: scholarships.filter(s => s.status === 'active').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      fundsDistributed: scholarships.filter(s => s.status === 'closed').reduce((acc, curr) => acc + curr.amount, 0), // Mock stat
      recentApplications: await Application.find({ scholarshipId: { $in: scholarshipIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('studentId', 'name email')
        .populate('scholarshipId', 'name')
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve dashboard stats' });
  }
});

// GET /api/providers/scholarships
// Get all scholarships created by this provider
router.get('/scholarships', async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ providerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ scholarships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scholarships' });
  }
});

// POST /api/providers/scholarships
// Create a new scholarship
router.post('/scholarships', async (req, res) => {
  try {
    const scholarshipData = {
      ...req.body,
      providerId: req.user.id,
      status: 'draft', // Requires admin approval to go active, or we can default to active for MVP
      isApproved: true // Default to true for MVP to make testing easier
    };

    if (req.body.publishNow) {
      scholarshipData.status = 'active';
    }

    const scholarship = await Scholarship.create(scholarshipData);
    res.status(201).json({ message: 'Scholarship created successfully', scholarship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create scholarship', details: error.message });
  }
});

// GET /api/providers/applications
// Get all applications for this provider's scholarships
router.get('/applications', async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ providerId: req.user.id });
    const scholarshipIds = scholarships.map(s => s._id);

    const applications = await Application.find({ scholarshipId: { $in: scholarshipIds } })
      .populate('studentId', 'name email')
      .populate('scholarshipId', 'name')
      .sort({ matchScore: -1 }); // Sort by AI score descending

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
});

// PUT /api/providers/applications/:id/status
// Update application status (e.g. pending -> reviewing, approved, rejected)
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Ensure the application belongs to a scholarship owned by this provider
    const application = await Application.findById(req.params.id).populate('scholarshipId');
    if (!application) return res.status(404).json({ error: 'Application not found' });
    
    if (application.scholarshipId.providerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET /api/providers/applications/:id/profile
// View the full student profile for a specific application
router.get('/applications/:id/profile', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('scholarshipId');
    if (!application) return res.status(404).json({ error: 'Application not found' });
    
    if (application.scholarshipId.providerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this profile' });
    }

    const studentProfile = await StudentProfile.findOne({ userId: application.studentId })
      .populate('userId', 'name email avatar');

    res.json({ profile: studentProfile, application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

module.exports = router;
