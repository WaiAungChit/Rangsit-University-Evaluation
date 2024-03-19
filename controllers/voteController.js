const mongoose = require('mongoose');
const Vote = require('../models/voteSchema'); 
const User = require('../models/userSchema');
const averageRatingController = require('../controllers/averageRatingController');

const vote = async (req, res) => {
    const { userId, votedFor, variable, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(votedFor)) {
        return res.status(400).json({ msg: 'Invalid user ID' });
    }

    if (userId.toString() === votedFor.toString()) {
        return res.status(400).json({ msg: 'You cannot vote for yourself' });
    }

    if (typeof variable !== 'string' || typeof rating !== 'number') {
        return res.status(400).json({ msg: 'Invalid input' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (user.voteLimit <= 0) {
            return res.status(400).json({ msg: 'You have reached your voting limit for today' });
        }

        const vote = new Vote({
            userId,
            votedFor,
            variable,
            rating
        });
        const savedVote = await vote.save();

        await User.findByIdAndUpdate(userId, { $push: { votes: savedVote._id }, $inc: { voteLimit: -1 } });

        // after saving the vote, calculate the average ratings
        await averageRatingController.calculateAverageRatings();

        res.json(savedVote);
    } catch (err) {
        res.status(500).json({ msg: 'An error occurred' });
    }
};

module.exports = {
    vote
};