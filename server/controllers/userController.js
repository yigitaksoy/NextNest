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
      subscription: true,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "An error occurred while registering user" });
  }
};

// GET route to fetch user search criteria
exports.getUserSearch = async (req, res, next) => {
  try {
    const user = req.user;

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

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({ message: "User not authenticated!" });
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
        subscription: true,
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

// POST route to handle user subscription
exports.handleSubscription = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({ message: "User not authenticated!" });
    }

    const { action } = req.body;

    // Handle 'toggle' action
    if (action === "toggle") {
      const userData = await User.findOne({ uid: user.uid });

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      userData.subscription = !userData.subscription;
      await userData.save();

      return res.json({
        message: "Subscription toggled successfully!",
        subscription: userData.subscription,
      });
    }

    // Handle 'unsubscribe' action
    else if (action === "unsubscribe") {
      const updatedUser = await User.findOneAndUpdate(
        { uid: user.uid },
        { subscription: false },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "Unsubscribed successfully!" });
    }

    // Handle unknown action
    else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling subscription:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling subscription" });
  }
};

// GET route to fetch user subscription status
exports.getSubscription = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({ message: "User not authenticated!" });
    }

    const userData = await User.findOne({ uid: user.uid }).select(
      "subscription"
    );

    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    return res.json({ subscription: userData.subscription });
  } catch (error) {
    console.error("Error getting subscription:", error);
    res
      .status(500)
      .json({ error: "An error occurred while getting subscription" });
  }
};
