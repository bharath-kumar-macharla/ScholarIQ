const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// Middleware to ensure route is accessed by a student
router.use(auth, authorize('student'));

// Helper function to calculate profile completion
const calculateCompletion = (profile, user) => {
  let score = 0;
  const totalWeight = 100;
  
  if (user.name && user.email) score += 10;
  if (profile.university) score += 10;
  if (profile.yearOfStudy) score += 10;
  if (profile.gpa) score += 15;
  if (profile.fieldOfStudy) score += 15;
  if (profile.skills && profile.skills.length > 0) score += 10;
  if (profile.careerInterests && profile.careerInterests.length > 0) score += 10;
  
  // Experience section (max 20 points)
  let expScore = 0;
  if (profile.hasInternship) expScore += 5;
  if (profile.hasHackathon) expScore += 5;
  if (profile.hasResearch) expScore += 5;
  if (profile.hasLeadership) expScore += 5;
  if (profile.hasVolunteering) expScore += 5;
  if (profile.hasOpenSource) expScore += 5;
  if (profile.projectCount > 0) expScore += 5;
  
  score += Math.min(expScore, 20); // Cap experience at 20 points
  
  return score;
};

// GET /api/students/profile
// Get current student profile
router.get('/profile', async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user.id });
    
    // Create empty profile if it doesn't exist
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user.id });
    }
    
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// PUT /api/students/profile
// Update student profile
router.put('/profile', async (req, res) => {
  try {
    const updateData = req.body;
    
    let profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user.id });
    }

    // Safely update allowed fields
    const allowedFields = [
      'university', 'yearOfStudy', 'gpa', 'fieldOfStudy',
      'skills', 'certifications', 'careerInterests', 'categories',
      'hasInternship', 'hasHackathon', 'hasResearch', 'hasLeadership',
      'hasVolunteering', 'hasOpenSource', 'projectCount'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        profile[field] = updateData[field];
      }
    });

    // Recalculate completion
    profile.profileCompletion = calculateCompletion(profile, req.user);
    
    // Simulate AI Score based on inputs for now (until actual ML model)
    const baseScore = profile.profileCompletion * 0.5;
    const bonusScore = (profile.gpa ? (profile.gpa / 4.0) * 20 : 0) + 
                       (profile.hasInternship ? 10 : 0) +
                       (profile.hasHackathon ? 5 : 0) +
                       (profile.hasLeadership ? 5 : 0) +
                       (profile.projectCount > 2 ? 10 : profile.projectCount * 3);
    profile.aiScore = Math.min(Math.round(baseScore + bonusScore), 100);

    await profile.save();

    res.json({ 
      message: 'Profile updated successfully',
      profile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/students/dashboard
// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    
    // Return mock stats for now since we don't have Scholarships/Applications yet
    res.json({
      completionPercentage: profile ? profile.profileCompletion : 0,
      aiScore: profile ? profile.aiScore : 0,
      stats: {
        savedCount: 0,
        appliedCount: 0,
        upcomingDeadlines: 0,
        totalEligibleAmount: 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard data' });
  }
});

module.exports = router;
