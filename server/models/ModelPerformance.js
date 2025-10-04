const mongoose = require('mongoose');

const modelPerformanceSchema = new mongoose.Schema({
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  precision: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  recall: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  f1Score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  totalPredictions: {
    type: Number,
    default: 0,
    min: 0
  },
  modelVersion: {
    type: String,
    default: '1.0.0'
  },
  trainingDataSize: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one performance record exists
modelPerformanceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ModelPerformance', modelPerformanceSchema);

