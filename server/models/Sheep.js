const mongoose = require('mongoose');

const sheepSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String },
    tagId: { type: String, unique: true, required: true },
    photoUrl: { type: String },
    identifyingMarks: { type: String },
    age: { type: Number },
    breed: { type: String },
    status: {
        type: String,
        enum: ['active', 'stolen', 'sold', 'deceased'],
        default: 'active'
    },
    lastSeenLocation: { type: String },
    theftReportedAt: { type: Date },
    theftDetails: { type: String },
    theftLocation: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [longitude, latitude]
    },
    createdAt: { type: Date, default: Date.now },
});

// Geospatial index for location-based queries
sheepSchema.index({ theftLocation: '2dsphere' });

module.exports = mongoose.model('Sheep', sheepSchema);
