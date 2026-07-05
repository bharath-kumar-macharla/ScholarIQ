const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  university: { type: String, default: '' },
  yearOfStudy: { type: String, default: '' },
  gpa: { type: Number, min: 0, max: 10 },
  fieldOfStudy: { type: String, default: '' },
  
  skills: [{ type: String }],
  certifications: [{ type: String }],
  careerInterests: [{ type: String }],
  categories: [{ type: String }], // Women in Tech, First-Gen, etc.

  hasInternship: { type: Boolean, default: false },
  hasHackathon: { type: Boolean, default: false },
  hasResearch: { type: Boolean, default: false },
  hasLeadership: { type: Boolean, default: false },
  hasVolunteering: { type: Boolean, default: false },
  hasOpenSource: { type: Boolean, default: false },
  projectCount: { type: Number, default: 0 },

  achievements: [{
    title: String,
    description: String,
    date: Date,
    type: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String
  }],
  research: [{
    title: String,
    journal: String,
    year: Number,
    link: String
  }],
  documents: [{
    type: { type: String }, // 'resume', 'transcript', etc.
    url: String,
    name: String
  }],
  
  profileCompletion: { type: Number, default: 0 }, // Calculated 0-100
  aiScore: { type: Number, default: 0 } // Overall competitiveness score
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
