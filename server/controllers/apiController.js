const { fetchListings } = require("../services/fetchListings");
const User = require("../models/user");

exports.scrapeListings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const queryParams = req.query;

    const result = await fetchListings(userId, queryParams);

    res.json(result);
  } catch (error) {
    console.error("Error occurred in /scrape-listings route:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

exports.syncListings = async () => {
  try {
    const users = await User.find({ subscription: true });

    for (const user of users) {
      if (user.userSearch && Object.keys(user.userSearch).length > 0) {
        const userId = user.uid;
        const queryParams = user.userSearch;

        await fetchListings(userId, queryParams);
      }
    }
  } catch (error) {
    console.error("Error occurred in cronFetchListings:", error);
    throw error;
  }
};
