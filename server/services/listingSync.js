const cron = require("node-cron");
const { syncListings } = require("../controllers/apiController");

// Schedule the job to run every 15 minutes between 7 am and 2 am
cron.schedule("*/15 7-13,0-1 * * *", async function () {
  console.log("Running a job every 15 minutes between 7 am and 2 am.");
  await syncListings();
  console.log("Done! Thank you for using NextNest! 🚀");
});
