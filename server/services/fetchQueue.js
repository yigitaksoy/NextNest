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
    maxTimeout: 1200000, // Set a maximum timeout to 20 minutes
    maxRetries: 5, // Set maximum retries
    retryDelay: 10000, // Set a delay of 10 seconds for each retry
  }
);

module.exports = fetchQueue;
