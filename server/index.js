require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { connectToDatabase } = require("./config/database");
const apiRoutes = require("./routes/api");
const errorHandler = require("./middleware/errorHandler");
const { verifyToken } = require("./middleware/verifyToken");

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
  .then((admin) => {
    console.log("Connected to the database");

    // Define a route for server status
    app.get("/", (req, res) => {
      res.send("Server Status: OK");
    });

    // API routes with token verification middleware
    app.use("/api", verifyToken(admin), apiRoutes);

    // Error handler middleware
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
