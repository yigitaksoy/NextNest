require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const admin = require("./config/firebaseAdmin");
const { connectToDatabase } = require("./config/database");
const { verifyToken } = require("./middleware/verifyToken");
const errorHandler = require("./middleware/errorHandler");
const apiRoutes = require("./routes/api");
const userRoutes = require("./routes/user");

// Sync Listings
require("./services/listingSync");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Set views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Connect to the database
connectToDatabase()
  .then(() => {
    console.log("Connected to the database");

    // Define a route for server status
    app.get("/", (req, res) => {
      res.send("Server Status: OK");
    });

    // Apply the middleware before the API routes
    app.use("/api", verifyToken(admin), apiRoutes);

    // User route
    app.use("/user", userRoutes);

    //Error handler middleware
    app.use(errorHandler);

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });
