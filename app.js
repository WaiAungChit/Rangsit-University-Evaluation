const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cron = require('node-cron');
const userRoutes = require('./routes/userRoute');
const voteRoutes = require('./routes/voteRoute');
const adminRoutes = require('./routes/adminRoute');
const averageRatingRoutes = require('./routes/averageRatingRoute');
const User = require('./models/userSchema'); 
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
require('dotenv').config()

app.use(
    cors({
      origin: "*",
      optionsSuccessStatus: 200,
    })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule('0 0 * * *', async () => {
  // Reset voteLimit for all users
  await User.updateMany({}, { voteLimit: 3 });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests limit
  message: "Too many requests from this IP, please try again later"
});

// limit requests from an IP
app.use(limiter);

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/averagerating',averageRatingRoutes);

// Start the server
const port = process.env.PORT || 8000;
connectDB();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
