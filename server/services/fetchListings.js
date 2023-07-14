const User = require("../models/user");
const Listing = require("../models/listing");
const { scrapeListings } = require("./listingService");
const sendEmail = require("../config/email");
const { v4: uuidv4 } = require("uuid");

exports.fetchListings = async (userId, queryParams) => {
  try {
    const {
      listingType,
      location,
      minPrice,
      maxPrice,
      minSize,
      minBedrooms,
      email,
      neighbourhood,
    } = queryParams;

    const listingTypeDutch = listingType === "huur" ? "huur" : "koop";

    let selectedArea = "";

    if (Array.isArray(neighbourhood) && neighbourhood.length > 0) {
      const neighbourhoodValues = neighbourhood
        .map((n) => n.value.trim())
        .filter(Boolean);
      if (neighbourhoodValues.length > 0) {
        selectedArea = neighbourhoodValues.map((val) => `"${val}"`).join(",");
      } else {
        selectedArea = `"${location}"`;
      }
    } else if (
      typeof neighbourhood === "string" &&
      neighbourhood.trim() !== ""
    ) {
      selectedArea = neighbourhood
        .split(",")
        .map((val) => `"${val.trim()}"`)
        .filter(Boolean)
        .join(",");
      if (selectedArea === "") {
        selectedArea = `"${location}"`;
      }
    } else {
      selectedArea = `"${location}"`;
    }

    let price = `"${minPrice}-${maxPrice}"`;
    let floorArea = minSize !== "0" ? `&floor_area="${minSize}-"` : "";
    let rooms = minBedrooms !== "0" ? `&rooms="${minBedrooms}-"` : "";

    let url = `https://www.funda.nl/en/zoeken/${listingTypeDutch}?selected_area=[${selectedArea}]&price=${price}${floorArea}${rooms}&publication_date=1`;

    let scrapedListings;
    try {
      scrapedListings = await scrapeListings(url, listingType);
    } catch (error) {
      console.error(
        `⛔ Error occurred while scraping listings from ${url}`,
        error
      );

      return;
    }

    const user = await User.findOne({ uid: userId });
    const newScrapedListings = scrapedListings.filter(
      (listing) =>
        !user.userListings.some(
          (userListing) => userListing.title === listing.title
        )
    );

    for (let i = 0; i < newScrapedListings.length; i++) {
      const listingId = uuidv4();

      // Check if a listing with the same title already exists in the "Listing" collection
      const existingListingInListings = await Listing.findOne({
        title: newScrapedListings[i].title,
      });

      // If a listing already exists in the /listings collection, dont fetch details. Instead, merge them from the existing collection.
      if (existingListingInListings) {
        console.log(
          `"${newScrapedListings[i].title}" already exists in Listings collection.`
        );
        newScrapedListings[i] = existingListingInListings;
      } else {
        let newListing = new Listing(newScrapedListings[i]);
        await newListing.save();
        newScrapedListings[i] = newListing;
      }

      // Check if a listing with the same title already exists in the user's "userListings" array
      const existingListingInUserListings = user.userListings.find(
        (userListing) => userListing.title === newScrapedListings[i].title
      );

      // If the listing does not exist in the user's "userListings" array, add it
      if (!existingListingInUserListings) {
        console.log("Updating user's userListings in the database");

        const details = newScrapedListings[i].details || {};
        const layout = details.layout || {};

        const price_per_m2 = details.price_per_m2 || "N/A";

        await User.findOneAndUpdate(
          { uid: userId },
          {
            $push: {
              userListings: {
                image: newScrapedListings[i].image,
                title: newScrapedListings[i].title,
                url: newScrapedListings[i].url,
                price: newScrapedListings[i].price,
                neighbourhood: newScrapedListings[i].neighbourhood,
                postal_code: newScrapedListings[i].postal_code,
                listingType: newScrapedListings[i].listingType,
                details: {
                  price_per_m2,
                  listed_since: details.listed_since || "N/A",
                  status: details.status || "N/A",
                  type_apartment: details.type_apartment || "N/A",
                  living_area: details.living_area || "N/A",
                  number_of_rooms: details.number_of_rooms || "N/A",
                  located_at: details.located_at || "N/A",
                },
              },
            },
          },
          { upsert: true, new: true }
        );

        console.log("Successfully updated user's userListings");
      } else {
        console.log(
          `"${newScrapedListings[i].title}" already exists in user's listings.`
        );
      }
    }

    if (newScrapedListings.length > 0) {
      console.log(`🏠 Found ${newScrapedListings.length} new listings!`);

      sendEmail(email, newScrapedListings);
      console.log(`✉️  Email sent to ${email}`);
    } else {
      console.log("No new listings found.");
    }

    return { listings: newScrapedListings };
  } catch (error) {
    console.error("⛔ Error occurred in fetchListings function:", error);
    throw error;
  }
};
