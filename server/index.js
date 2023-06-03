require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { connectToDatabase } = require("./config/database");
const apiRoutes = require("./routes/api");
const errorHandler = require("./middleware/errorHandler");

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

    app.get("/", (req, res) => {
      res.send("Server Status: OK");
    });

    // API routes
    app.use("/api", apiRoutes);

    // Error handler middleware
    app.use(errorHandler);

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
