const User = require('../models/userSchema');
const Vote = require('../models/voteSchema');
const AverageRating = require('../models/averageRatingSchema');

exports.calculateAverageRatings = async () => {
    try {
        const users = await User.find();

        for (const user of users) {
            const votes = await Vote.find({ votedFor: user._id });

            const totalRatings = {};

            votes.forEach(vote => {
                const variable = vote.variable;
                const rating = vote.rating ? vote.rating : 0;

                if (!totalRatings[variable]) {
                    totalRatings[variable] = { totalRating: 0, numVotes: 0 };
                }

                totalRatings[variable].totalRating += rating;
                totalRatings[variable].numVotes++;

                totalRatings[variable].percent = (totalRatings[variable].totalRating / totalRatings[variable].numVotes) * 20;
            });

            let totalRatingSum = 0;
            let numVariables = 0;

            for (const variable in totalRatings) {
                totalRatingSum += (totalRatings[variable].percent / 20);
                numVariables++;
            }

            const averageRating = (numVariables > 0 ? totalRatingSum / numVariables : 0).toFixed(2);

            const averageRatingDoc = await AverageRating.findOneAndUpdate(
                { userId: user._id },
                {
                    date: new Date(),
                    averageEuphoric: totalRatings['Euphoric'] ? totalRatings['Euphoric'].percent : 0,
                    averageInnovative: totalRatings['Innovative'] ? totalRatings['Innovative'].percent : 0,
                    averageSupervision: totalRatings['Supervision'] ? totalRatings['Supervision'].percent : 0,
                    averageCounterbalance: totalRatings['Counterbalance'] ? totalRatings['Counterbalance'].percent : 0,
                    overallAverage: averageRating
                },
                { new: true, upsert: true }
            );

            user.averageRatings.push(averageRatingDoc._id);
            await user.save();
        }

        console.log('Average ratings calculated and stored successfully');
    } catch (err) {
        console.error('Error calculating and storing average ratings:', err);
    }
};

exports.getAverageRatingsForDate = async (req, res) => {
    try {
        const date = new Date(req.params.date);

        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        const averageRatings = await AverageRating.find({
            date: {
                $gte: start,
                $lt: end
            }
        }).populate('userId', 'username -_id');

        if (averageRatings.length > 0) {
            res.status(200).json(averageRatings);
        } else {
            res.status(404).send('No average ratings found for this date');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching average ratings');
    }
};

exports.getAverageRatingsForWeek = async (req, res) => {
    try {
        const date = new Date(req.params.date);

        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);

        const averageRatings = await AverageRating.find({
            date: {
                $gte: start,
                $lt: end
            }
        }).populate('userId', 'username -_id');

        if (averageRatings.length > 0) {
            res.status(200).json(averageRatings);
        } else {
            res.status(404).send('No average ratings found for this week');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching average ratings');
    }
};


exports.getAllAverageRatings = async (req, res) => {
    try {
        const averageRatings = await AverageRating.find();

        res.status(200).json(averageRatings);
    } catch (err) {
        console.error('Error fetching average ratings:', err);
        res.status(500).send('Error fetching average ratings');
    }
};