const mongoose = require('mongoose');

const AverageRatingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    averageEuphoric: {
        type: Number,
        default: 0
    },
    averageInnovative: {
        type: Number,
        default: 0
    },
    averageSupervision: {
        type: Number,
        default: 0
    },
    averageCounterbalance: {
        type: Number,
        default: 0
    },
    overallAverage: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('AverageRating', AverageRatingSchema);