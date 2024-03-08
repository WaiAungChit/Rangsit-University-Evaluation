const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: Number,
        unique: true,
        minlength: [7, 'ID must be at least 7 characters long'], 
        required: true 
    },

    name:{
        type: String,
        required: true
    }, 

    nickname: {
        type: String,
        required: true 
    },

    jobTitle: {
        type: String,
        required: true 
    },

    jobDescription: {
        type: String,
        required: true 
    },

    profilePicture: { 
        type: String, 
        required: true 
    },

    voteLimit: {
        type: Number,
        default: 4
    },

    loginAttempts: {
        type: Number,
        required: true,
        default: 3
      },
    
      attemptResetTime: {
        type: Date
      },
      
    votes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote' 
    }],
}, 
{ timestamps: true });

module.exports = mongoose.model('User', UserSchema);