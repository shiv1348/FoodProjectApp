const mongoose = require("mongoose")

const connectDatabase = () => {
  if (!process.env.DB_URL) {
    console.error("⚠️ WARNING: process.env.DB_URL is missing or undefined! Please set DB_URL in environment variables.");
    return;
  }
  mongoose
    .connect(process.env.DB_URL)
    .then((con) => {
      console.log(`MongoDB Database connected with HOST:${con.connection.host}`);
    })
    .catch((error) => {
      console.error(`MongoDB connection failed: ${error.message}`);
    });
};

module.exports = connectDatabase