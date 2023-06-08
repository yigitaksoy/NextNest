const express = require("express");
const { scrapeListings } = require("../services/listingService");
const sendEmail = require("../config/email");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const { serviceAccount, firebaseConfig } = require("../config/firebaseConfig");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL,
});

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

  try {
    const scrapedListings = await scrapeListings(url, email);

    // Save the scraped listings to Firestore
    const db = admin.firestore();
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const user = await admin.auth().verifyIdToken(token);

    if (user) {
      const userId = user.uid;
      const userListingsCollection = db.collection(
        `users/${userId}/userListings`
      );

      for (const listing of scrapedListings) {
        console.log("Listing object:", listing);

        const listingId = uuidv4();
        await userListingsCollection
          .doc(listingId)
          .set(listing, { merge: true });
      }

      // Send email with the scraped listings
      sendEmail(email, scrapedListings);

      console.log("Email sent");
      res.json({ listings: scrapedListings });
    } else {
      console.error("No user is signed in");
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error scraping listings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping listings" });
  }
});

module.exports = router;
