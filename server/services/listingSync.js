const cron = require("node-cron");
const { syncListings } = require("../controllers/apiController");

async function syncJob() {
  console.log("Running a job every 5 minutes between 7 am and 2 am.");
  await syncListings();
  console.log("Done! Thank you for using NextNest! 🚀");
}

// Schedule the job to run every 5 minutes between 7 am and 11:59 pm
cron.schedule("*/5 7-23 * * *", syncJob);

// Schedule the job to run every 5 minutes between 12 am and 2 am
cron.schedule("*/5 0-2 * * *", syncJob);
