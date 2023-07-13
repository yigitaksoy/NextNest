const Queue = require("better-queue");

const fetchQueue = new Queue(
  async function (input, callback) {
    const { userId, queryParams, fetchFunction } = input;

    try {
      const result = await fetchFunction(userId, queryParams);
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  },
  {
    concurrent: 1, // Limit the number of concurrent jobs
    maxTimeout: 120000, // Set a maximum timeout to 2 minutes
  }
);

module.exports = fetchQueue;
