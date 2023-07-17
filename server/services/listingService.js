const { initializeBrowser } = require("../utils/browser");
const { initializePage } = require("../utils/page");
const { fetchAndExtractListings } = require("../utils/listings");
const Listing = require("../models/listing");
const { listingDetails } = require("./listingDetails");

const listingService = async (url, listingType) => {
  console.log(`🔍 Fetching listings: ${url}`);

  const browser = await initializeBrowser();

  try {
    const page = await initializePage(browser, url);
    const allListings = [];
    let currentPage = 1;

    while (true) {
      console.log("Fetching page:", currentPage);

      let rawListings = await fetchAndExtractListings(page, url);

      for (let i = 0; i < rawListings.length; i++) {
        try {
          const listing = rawListings[i];
          let existingListingInListings = await Listing.findOne({
            title: listing.title,
          });

          if (!existingListingInListings) {
            const details = await listingDetails(
              page,
              listing.url,
              listingType
            );
            listing.details = details;
            listing.listingType = listingType;
            listing.neighbourhood = details.neighbourhood;
          }
        } catch (error) {
          console.error(`⛔ Error fetching details for listing ${i}:`, error);
        }
      }

      allListings.push(...rawListings);

      const nextPageButton = await page.$(
        ".pagination-pages a[aria-current='page'] + a"
      );
      if (!nextPageButton || currentPage >= 28) {
        break;
      }

      currentPage++;
      url = await page.evaluate(
        (nextPageButton) => nextPageButton.href,
        nextPageButton
      );
    }

    allListings.forEach((listing) => {
      console.log("Listing URL:", listing.url);
    });

    return allListings;
  } catch (error) {
    console.error("⛔ Error fetching listings:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = {
  listingService,
};
