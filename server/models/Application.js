const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scholarshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview', 'approved', 'rejected'],
    default: 'pending'
  },
  matchScore: { type: Number, required: true }, // The AI match score at time of application
  
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId, // Refers to customQuestions in Scholarship
    question: String,
    answer: String
  }],
  
  documents: [{
    type: { type: String }, // 'resume', 'transcript', 'essay'
    url: String,
    name: String
  }],

  reviewNotes: { type: String } // For provider internal use
}, {
  timestamps: true
});

// Prevent multiple applications to the same scholarship
applicationSchema.index({ studentId: 1, scholarshipId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
