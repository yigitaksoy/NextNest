const fetchQueue = require("../services/fetchQueue");
const { fetchListings } = require("../services/fetchListings");
const User = require("../models/user");

exports.listingService = async (req, res) => {
  try {
    const userId = req.user.uid;
    const queryParams = req.query;

    fetchQueue.push({
      userId,
      queryParams,
      fetchFunction: fetchListings,
    });
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

    // Create an array of jobs
    const jobs = users
      .filter(
        (user) => user.userSearch && Object.keys(user.userSearch).length > 0
      )
      .map((user) => {
        const userId = user.uid;
        const queryParams = user.userSearch;

        // Return a promise for each job
        return new Promise((resolve, reject) => {
          fetchQueue.push(
            {
              userId,
              queryParams,
              fetchFunction: fetchListings,
            },
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      });

    // Wait for all jobs to finish
    await Promise.all(jobs);
  } catch (error) {
    console.error("Error occurred in syncListings:", error);
    throw error;
  }
};
