const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURI = process.env.dbURI;
    await mongoose.connect(dbURI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;