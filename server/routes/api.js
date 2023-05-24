const express = require("express");
const router = express.Router();
const { scrapeListings } = require("../services/listingService");

router.get("/scrape-listings", async (req, res) => {
  const {
    listingType,
    location,
    minPrice,
    maxPrice,
    minSize,
    minBedrooms,
    maxAge,
  } = req.query;

  // Determine the listing type based on the query parameter
  const listingTypeDutch = listingType === "forRent" ? "huur" : "koop";

  // Build the URL based on the query parameters and listing type
  const url = `https://www.funda.nl/en/${listingTypeDutch}/${location}/beschikbaar/${minPrice}-${maxPrice}/${minSize}+woonopp/${minBedrooms}+slaapkamers/${maxAge}-dag/`;

  try {
    // Call the listing service to scrape the listings
    const scrapedListings = await scrapeListings(url);

    // Return the scraped listings as the API response
    res.json({ listings: scrapedListings });
  } catch (error) {
    // Handle any errors that occur during scraping
    console.error("Error scraping listings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping listings" });
  }
});

module.exports = router;
