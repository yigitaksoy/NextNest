const express = require("express");
const connectToDatabase = require("./config/database");

// Create Express app
const app = express();

// Load environment variables from .env file
require("dotenv").config();

// Connect to the database
connectToDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
