const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  maxApplicants: { type: Number, default: 0 }, // 0 means unlimited
  currentApplicants: { type: Number, default: 0 },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'archived'],
    default: 'draft'
  },
  isApproved: { type: Boolean, default: false }, // Admin approval

  category: { type: String, required: true }, // Need-based, Merit-based, etc.
  degree: { type: String }, // Bachelors, Masters, etc.
  country: { type: String },
  state: { type: String },
  
  eligibility: {
    minGPA: { type: Number, default: 0 },
    maxIncome: { type: Number },
    ageLimit: { type: Number },
    fields: [{ type: String }],
    skills: [{ type: String }],
    certifications: [{ type: String }],
    requiresInternship: { type: Boolean, default: false },
    requiresHackathon: { type: Boolean, default: false },
    requiresResearch: { type: Boolean, default: false },
    requiresLeadership: { type: Boolean, default: false },
    requiresVolunteering: { type: Boolean, default: false },
    requiresOpenSource: { type: Boolean, default: false },
    categories: [{ type: String }] // First-Gen, Women in Tech, etc.
  },

  requiredDocuments: [{ type: String }], // 'resume', 'transcript', 'essay'
  selectionProcess: { type: String },
  interviewRequired: { type: Boolean, default: false },
  
  customQuestions: [{
    question: String,
    type: { type: String, enum: ['text', 'choice', 'file'] },
    options: [String],
    required: Boolean
  }],

  tags: [{ type: String }],
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index for text search
scholarshipSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
