const express = require("express");
const { scrapeListings } = require("../services/listingService");
const sendEmail = require("../config/email");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const Listing = require("../models/listing");

const router = express.Router();

router.get("/scrape-listings", async (req, res) => {
  try {
    const {
      listingType,
      location,
      minPrice,
      maxPrice,
      minSize,
      minBedrooms,
      email,
    } = req.query;

    const listingTypeDutch = listingType === "huur" ? "huur" : "koop";
    const url = `https://www.funda.nl/en/${listingTypeDutch}/${location}/beschikbaar/${minPrice}-${maxPrice}/${minSize}+woonopp/${minBedrooms}+kamers/1-dag/`;

    console.log(`Started scraping listings for URL: ${url}`);
    const scrapedListings = await scrapeListings(url);
    console.log(`Scraped listings for user ${email}:`, scrapedListings);
    console.log(
      `Scraped ${scrapedListings.length} listings. Preparing to send email to ${email}`
    );

    sendEmail(email, scrapedListings);

    console.log("Email sent");

    const userId = req.user.uid;

    for (const listing of scrapedListings) {
      const listingId = uuidv4();

      let newListing = new Listing(listing);
      await newListing.save();

      console.log("Updating user's userListings in the database");
      await User.findOneAndUpdate(
        { uid: userId },
        { $push: { userListings: listing } },
        { upsert: true, new: true }
      );
      console.log("Successfully updated user's userListings");
    }

    res.json({ listings: scrapedListings });
  } catch (error) {
    console.error("Error occurred in /scrape-listings route:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

module.exports = router;
