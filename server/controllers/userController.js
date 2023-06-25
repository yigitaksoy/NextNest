const User = require("../models/user");
const mongoose = require("mongoose");

// POST route to register a user
exports.register = async (req, res) => {
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
};

// GET route to fetch user search criteria
exports.getUserSearch = async (req, res, next) => {
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
};

// POST route to save user search criteria
exports.saveUserSearch = async (req, res, next) => {
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
};
