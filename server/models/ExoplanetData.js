const mongoose = require('mongoose');

const exoplanetDataSchema = new mongoose.Schema({
  orbital_period: {
    type: Number,
    required: true,
    min: 0
  },
  transit_duration: {
    type: Number,
    required: true,
    min: 0
  },
  planetary_radius: {
    type: Number,
    required: true,
    min: 0
  },
  stellar_radius: {
    type: Number,
    default: 1.0,
    min: 0
  },
  stellar_mass: {
    type: Number,
    default: 1.0,
    min: 0
  },
  stellar_temperature: {
    type: Number,
    default: 5778,
    min: 0
  },
  prediction: {
    type: String,
    enum: ['Confirmed Exoplanet', 'Planetary Candidate', 'False Positive'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user_ip: {
    type: String,
    default: 'unknown'
  }
}, {
  timestamps: true
});

// Index for efficient queries
exoplanetDataSchema.index({ timestamp: -1 });
exoplanetDataSchema.index({ prediction: 1 });
exoplanetDataSchema.index({ confidence: -1 });

module.exports = mongoose.model('ExoplanetData', exoplanetDataSchema);

