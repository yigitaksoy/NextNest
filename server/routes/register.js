const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const { uid, email } = req.body;

    // Create the user document in the `/users` collection
    await mongoose.connection.collection("users").insertOne({
      uid,
      email,
      userSearch: {},
      userListings: [],
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An error occurred while registering user" });
  }
});

module.exports = router;
