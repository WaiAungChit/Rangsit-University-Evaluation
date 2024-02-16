const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    votedFor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    variable: { 
        type: String, 
        enum: ['Euphoric','Innovative','Supervision','Counterbalance'], 
        required: true 
    },
    rating: { 
        type: Number,
        enum: [1,2,3,4,5], 
        required: true 
    }
},
{ timestamps: true });

module.exports = mongoose.model('Vote', VoteSchema);
