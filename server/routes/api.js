const express = require("express");
const { scrapeListings } = require("../services/listingService");
const sendEmail = require("../config/email");

const router = express.Router();

router.get("/scrape-listings", async (req, res) => {
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

  console.log("Form Data:", req.query);
  console.log("URL:", url);
  console.log("Scraping listings...");

  try {
    const scrapedListings = await scrapeListings(url, email);

    // Send email with the scraped listings
    sendEmail(email, scrapedListings);

    console.log("Email sent");
    res.json({ listings: scrapedListings });
  } catch (error) {
    console.error("Error scraping listings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping listings" });
  }
});

module.exports = router;
