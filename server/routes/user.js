const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Replace with your User model

// GET route to fetch user search criteria
router.get("/search", async (req, res, next) => {
  try {
    const user = req.user;
    console.log("FETCH User information:", user); // Debug statement

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const searchCriteria = await User.findOne({ uid: user.uid }).select(
      "userSearch"
    );

    if (!searchCriteria) {
      return res.status(404).json({ message: "Search criteria not found" });
    }

    res.json(searchCriteria.userSearch);
  } catch (error) {
    next(error);
  }
});

// POST route to save user search criteria
router.post("/search", async (req, res, next) => {
  try {
    const user = req.user;
    console.log("SAVE User information:", user); // Debug statement

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const {
      listingType,
      location,
      neighbourhood,
      minPrice,
      maxPrice,
      minSize,
      minBedrooms,
      email,
    } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { uid: user.uid },
      {
        userSearch: {
          listingType,
          location,
          neighbourhood,
          minPrice,
          maxPrice,
          minSize,
          minBedrooms,
          email,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser.userSearch);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
