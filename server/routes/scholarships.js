const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const StudentProfile = require('../models/StudentProfile');
const SavedScholarship = require('../models/SavedScholarship');
const Application = require('../models/Application');
const { auth, optionalAuth } = require('../middleware/auth');
const { calculateMatchScore } = require('../services/matcherService');

// Seed script helper to generate dummy data quickly during dev
router.post('/seed', async (req, res) => {
  try {
    const defaultProviderId = req.user ? req.user.id : "60d0fe4f5311236168a109ca"; // Dummy if not authenticated
    
    await Scholarship.deleteMany({});
    
    const dummyScholarships = [
      {
        providerId: defaultProviderId,
        name: "Women in Tech Excellence Award",
        description: "Supporting outstanding female students pursuing degrees in Computer Science or related fields.",
        amount: 10000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active',
        isApproved: true,
        category: 'Merit-based',
        eligibility: {
          minGPA: 3.5,
          fields: ['Computer Science', 'Software Engineering'],
          categories: ['Women in Tech'],
          requiresLeadership: true
        }
      },
      {
        providerId: defaultProviderId,
        name: "Open Source Contributor Grant",
        description: "For students who have made significant contributions to open source projects.",
        amount: 5000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'active',
        isApproved: true,
        category: 'Achievement-based',
        eligibility: {
          minGPA: 3.0,
          requiresOpenSource: true,
          skills: ['Git', 'JavaScript', 'Python']
        }
      },
      {
        providerId: defaultProviderId,
        name: "First-Generation College Student Fund",
        description: "Empowering first-generation college students to achieve their academic dreams.",
        amount: 7500,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'active',
        isApproved: true,
        category: 'Need-based',
        eligibility: {
          minGPA: 2.5,
          categories: ['First-Generation']
        }
      },
      {
        providerId: defaultProviderId,
        name: "Future AI Researchers Fellowship",
        description: "Funding for students actively conducting research in Artificial Intelligence.",
        amount: 15000,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'active',
        isApproved: true,
        category: 'Research',
        eligibility: {
          minGPA: 3.8,
          requiresResearch: true,
          fields: ['Artificial Intelligence', 'Computer Science', 'Machine Learning']
        }
      }
    ];

    await Scholarship.insertMany(dummyScholarships);
    res.json({ message: "Seed successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/scholarships
// Get all active, approved scholarships (with optional matching)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category, minAmount } = req.query;
    
    // Build query
    const query = { status: 'active', isApproved: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (minAmount) {
      query.amount = { $gte: Number(minAmount) };
    }

    let scholarships = await Scholarship.find(query).sort({ createdAt: -1 });

    // If user is authenticated as a student, calculate match scores
    if (req.user && req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ userId: req.user.id });
      const saved = await SavedScholarship.find({ studentId: req.user.id }).select('scholarshipId');
      const savedIds = saved.map(s => s.scholarshipId.toString());

      if (studentProfile) {
        scholarships = scholarships.map(sch => {
          const matchResult = calculateMatchScore(studentProfile, sch);
          return {
            ...sch.toObject(),
            matchScore: matchResult.score,
            isEligible: matchResult.isEligible,
            isSaved: savedIds.includes(sch._id.toString())
          };
        });
        
        // Sort by match score descending
        scholarships.sort((a, b) => b.matchScore - a.matchScore);
      }
    }

    res.json({ scholarships });
  } catch (error) {
    console.error('Get scholarships error:', error);
    res.status(500).json({ error: 'Failed to retrieve scholarships' });
  }
});

// GET /api/scholarships/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).populate('providerId', 'name email avatar');
    
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    // Increment views
    scholarship.views += 1;
    await scholarship.save();

    let result = scholarship.toObject();

    if (req.user && req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ userId: req.user.id });
      const saved = await SavedScholarship.findOne({ studentId: req.user.id, scholarshipId: scholarship._id });
      const applied = await Application.findOne({ studentId: req.user.id, scholarshipId: scholarship._id });
      
      if (studentProfile) {
        const matchResult = calculateMatchScore(studentProfile, scholarship);
        result.matchScore = matchResult.score;
        result.matchDetails = matchResult.details;
        result.isEligible = matchResult.isEligible;
      }
      
      result.isSaved = !!saved;
      result.hasApplied = !!applied;
      if (applied) {
        result.applicationStatus = applied.status;
      }
    }

    res.json({ scholarship: result });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/scholarships/:id/save
// Toggle save status
router.post('/:id/save', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Only students can save scholarships' });
    
    const scholarshipId = req.params.id;
    const existing = await SavedScholarship.findOne({ studentId: req.user.id, scholarshipId });
    
    if (existing) {
      await SavedScholarship.findByIdAndDelete(existing._id);
      return res.json({ message: 'Scholarship removed from saved', isSaved: false });
    } else {
      await SavedScholarship.create({ studentId: req.user.id, scholarshipId });
      return res.json({ message: 'Scholarship saved', isSaved: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle save status' });
  }
});

// POST /api/scholarships/:id/apply
router.post('/:id/apply', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Only students can apply' });
    
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship || scholarship.status !== 'active') {
      return res.status(400).json({ error: 'Scholarship is not active' });
    }

    const existing = await Application.findOne({ studentId: req.user.id, scholarshipId: scholarship._id });
    if (existing) {
      return res.status(400).json({ error: 'You have already applied for this scholarship' });
    }

    const studentProfile = await StudentProfile.findOne({ userId: req.user.id });
    const matchResult = calculateMatchScore(studentProfile, scholarship);

    const application = await Application.create({
      studentId: req.user.id,
      scholarshipId: scholarship._id,
      providerId: scholarship.providerId,
      matchScore: matchResult.score,
      answers: req.body.answers || [],
      documents: req.body.documents || []
    });

    scholarship.currentApplicants += 1;
    await scholarship.save();

    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

module.exports = router;
