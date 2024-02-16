const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminSchema');
const User = require('../models/userSchema');
const Vote = require('../models/voteSchema');
const cloudinary = require('../config/cloudinary');
const { body, validationResult } = require('express-validator');
const upload = require('../middlewares/imageUpload');
const mongoose = require('mongoose');
const multer = require('multer');

const signup = async (req, res) => {
    const { username, password, secretKey } = req.body;

    try {
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ msg: 'Forbidden' });
        }

        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return res.status(400).json({ msg: 'An admin already exists' });
        }

        const admin = new Admin({ username, password });
        await admin.save();

        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Admin Account Create Successful', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while signing up' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin || !await admin.validatePassword(password)) {
            return res.status(401).json({ msg: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
};

const changePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
          return res.status(404).json({ error: 'Admin not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Ols password is wrong' });
      }

      admin.password = newPassword;
      await admin.save();

      res.json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the password' });
  }
};

const forgotPassword = async (req, res) => {
  const { username, secretKey, newPassword } = req.body;

  if (!username || !secretKey || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
          return res.status(404).json({ error: 'Admin not found' });
      }

      if (secretKey !== process.env.ADMIN_SECRET_KEY) {
          return res.status(400).json({ error: 'Invalid secret key' });
      }

      admin.password = newPassword;
      await admin.save();

      res.json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the password' });
  }
};

const deleteAdmin = async (req, res) => {
    const { username, password, secretKey, confirmation } = req.body;

    try {
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ msg: 'Forbidden' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password' });
        }

        if (confirmation !== 'I want to delete admin account') {
            return res.status(400).json({ msg: 'Confirmation message is incorrect' });
        }

        await Admin.findByIdAndDelete(admin._id);

        res.json({ msg: 'Admin deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the admin' });
    }
};

const createUser = [
  (req, res, next) => {
      upload.single('profilePicture')(req, res, (err) => {
          if (err instanceof multer.MulterError) {
              return res.status(400).json({ error: 'An error occurred while uploading the file' });
          } else if (err) {
              return res.status(500).json({ error: 'An unknown error occurred' });
          }
          next();
      });
  },
  body('username').notEmpty().withMessage('Username is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, name, nickname, jobTitle, jobDescription } = req.body;

      // Upload the image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(req.file.buffer);
      });

      // Store the URL of the uploaded image in MongoDB
      const profilePicture = result.url;

      const user = new User({ username, profilePicture, name, nickname, jobTitle, jobDescription });
      await user.save();

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  }
];

const deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await User.findByIdAndDelete(userId);

        res.json({ msg: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};

const updateProfilePicture = [
  (req, res, next) => {
      upload.single('profilePicture')(req, res, (err) => {
          if (err instanceof multer.MulterError) {
              return res.status(400).json({ error: 'An error occurred while uploading the file' });
          } else if (err) {
              return res.status(500).json({ error: 'An unknown error occurred' });
          }
          next();
      });
  },
  async (req, res) => {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ error: 'Invalid user ID' });
      }

      if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
          // Upload the new image to Cloudinary
          const result = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
              }).end(req.file.buffer);
          });

          const profilePicture = result.url;
          const user = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });

          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }

          res.json(user);
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'An error occurred while updating the profile picture' });
      }
  }
];

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().populate({
        path: 'votes',
        populate: [
            { path: 'userId', select: 'username -_id' },
            { path: 'votedFor', select: 'username -_id' }
        ]
    });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving users' });
    }
};

const getAllVotes = async (req, res) => {
    try {
      const votes = await Vote.find()
      .populate({
          path: 'userId',
          select: 'username -_id'
      })
      .populate({
          path: 'votedFor',
          select: 'username -_id'
      });
        res.json(votes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving votes' });
    }
};

const updateVoteLimit = async (req, res) => {
    const { voteLimit } = req.body;

    if (typeof voteLimit !== 'number' || voteLimit < 0) {
        return res.status(400).json({ msg: 'Invalid vote limit' });
    }

    try {
        await User.updateMany({}, { voteLimit });

        res.json({ msg: 'Vote limit updated successfully for all users' });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ msg: 'An error occurred' });
    }
};

module.exports = {
    signup,
    login,
    changePassword,
    updateVoteLimit,
    forgotPassword, 
    deleteAdmin,
    createUser,
    deleteUser,
    updateProfilePicture,
    getAllUsers,
    getAllVotes,
    updateVoteLimit
};