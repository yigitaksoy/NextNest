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
    let neighbourhoods = "";

    if (Array.isArray(neighbourhood)) {
      neighbourhoods = neighbourhood.map((obj) => obj.value).join(",");
    } else if (typeof neighbourhood === "object") {
      neighbourhoods = neighbourhood.value;
    } else {
      neighbourhoods = neighbourhood;
    }

    let minSizeString = minSize !== "0" ? `${minSize}+woonopp/` : "";
    let minBedroomsString = minBedrooms !== "0" ? `${minBedrooms}+kamers/` : "";

    let url = `https://www.funda.nl/en/${listingTypeDutch}/${location}/${
      neighbourhoods ? neighbourhoods + "/" : ""
    }beschikbaar/${minPrice}-${maxPrice}/${minSizeString}${minBedroomsString}1-dag/`;

    const scrapedListings = await scrapeListings(url, listingType);

    const user = await User.findOne({ uid: userId });
    const newScrapedListings = scrapedListings.filter(
      (listing) =>
        !user.userListings.some(
          (userListing) => userListing.title === listing.title
        )
    );

    if (newScrapedListings.length > 0) {
      console.log(
        `Scraped ${newScrapedListings.length} new listings. Preparing to send email to ${email}`
      );

      sendEmail(email, newScrapedListings);
      console.log("Email sent");
    } else {
      console.log("No new listings to send email about.");
    }

    for (const listing of newScrapedListings) {
      const listingId = uuidv4();

      // Check if a listing with the same title already exists in the "Listing" collection
      const existingListingInListings = await Listing.findOne({
        title: listing.title,
      });

      // If the listing does not exist in the "Listing" collection, add it
      if (!existingListingInListings) {
        let newListing = new Listing(listing);
        await newListing.save();
      } else {
        console.log(
          `Listing "${listing.title}" already exists in Listings collection.`
        );
      }

      // Check if a listing with the same title already exists in the user's "userListings" array
      const existingListingInUserListings = user.userListings.find(
        (userListing) => userListing.title === listing.title
      );

      // If the listing does not exist in the user's "userListings" array, add it
      if (!existingListingInUserListings) {
        console.log("Updating user's userListings in the database");
        const details = listing.details || {};
        const layout = details.layout || {};

        const price_per_m2 = details.price_per_m2 || "N/A";

        await User.findOneAndUpdate(
          { uid: userId },
          {
            $push: {
              userListings: {
                image: listing.image,
                title: listing.title,
                url: listing.url,
                price: listing.price,
                neighbourhood: listing.neighbourhood,
                postal_code: listing.postal_code,
                listingType: listing.listingType,
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
          `Listing "${listing.title}" already exists in user's userListings.`
        );
      }
    }

    return { listings: newScrapedListings };
  } catch (error) {
    console.error("Error occurred in fetchListings function:", error);
    throw error;
  }
};
