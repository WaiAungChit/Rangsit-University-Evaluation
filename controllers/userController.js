const mongoose = require('mongoose');
const User = require('../models/userSchema');

const loginUser = async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
          return res.status(400).json({ message: 'Invalid username' });
      }

      // reset the attempt reset time to the current time
      if (!user.attemptResetTime || Date.now() - user.attemptResetTime.getTime() >= 24 * 60 * 60 * 1000) {
          user.attemptResetTime = Date.now();
      }

      if (user.loginAttempts <= 0) {
          return res.status(400).json({ message: 'You have exceeded the maximum number of login attempts for today. Please try again tomorrow.' });
      }

      user.loginAttempts--;
      await user.save();
      res.json({ userId: user._id });

  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

const getAllUsersExceptCurrent = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'Invalid user ID' });
    }

    try {
        const users = await User.find({ _id: { $ne: userId } });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getUserbyID = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = {
    loginUser,getAllUsersExceptCurrent,getUserbyID
};