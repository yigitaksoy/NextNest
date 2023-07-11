const listingDetails = async (page, url, listingType) => {
  console.log("Fetching details for:", url);

  try {
    let navigationAttempts = 0;
    while (navigationAttempts < 5) {
      // Maximum 5 attempts
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForTimeout(Math.random() * 10000);

        // Extract the page title
        const title = await page.title();

        // If the page title is in Dutch, try to switch language
        if (title.includes("te koop") || title.includes("te huur")) {
          try {
            await page.waitForSelector("#langSwitch", { timeout: 5000 });
            await page.select("#langSwitch", "en");
            await page.waitForTimeout(5000);
          } catch (error) {
            console.log("Could not find language switcher");
          }
        }

        break;
      } catch (error) {
        navigationAttempts++;
        console.error(
          `Error during navigation attempt ${navigationAttempts}: ${error}`
        );
        if (navigationAttempts >= 5) throw error;
        await page.waitForTimeout(5000);
      }
    }

    // Wait for a random amount of time between 0 to 10 seconds
    await page.waitForTimeout(Math.random() * 10000);

    // Extract the page title
    const title = await page.title();
    console.log("Page Title:", title);

    let rawDetails;
    try {
      rawDetails = await page.evaluate(() => {
        const details = {};
        const dtElements = document.querySelectorAll(
          ".object-kenmerken-list dt"
        );
        dtElements.forEach((dt) => {
          const dd = dt.nextElementSibling;
          if (dd && dd.tagName.toLowerCase() === "dd") {
            let label = dt.textContent.trim().split("\n")[0];
            let valueElement = dd.querySelector("span");
            let value = valueElement
              ? valueElement.textContent
                  .trim()
                  .split("\n")
                  .map((str) => str.trim())
                  .join(" ")
              : undefined;

            // Extract the number of bedrooms
            if (label === "Number of rooms") {
              value = value.replace(
                /^.+?\((\d+)\s+bedrooms?\)/i,
                "$1 bedrooms"
              );
            }

            details[label] = value;
          }
        });

        // Extract the neighborhood
        const breadcrumbElements =
          document.querySelectorAll(".breadcrumb-list a");
        const neighborhoodElement =
          breadcrumbElements[breadcrumbElements.length - 1];
        if (neighborhoodElement) {
          details["Neighborhood"] = neighborhoodElement.textContent.trim();
        }

        // Extract the price per m²
        const pricePerM2Element = document.querySelector(
          ".object-kenmerken-list__asking-price"
        );
        if (pricePerM2Element) {
          details["Asking price per m²"] = pricePerM2Element.textContent
            .trim()
            .split("\n")[0];
        }

        return details;
      });
    } catch (error) {
      console.error("Error during page evaluation:", error);
      // Implement your own error handling logic here...
    }

    // Add Today's Date for the new listings
    if (rawDetails["Listed since"] === "Today") {
      const currentDate = new Date().toISOString().split("T")[0];
      rawDetails["Listed since"] = currentDate;
    }

    // Structure the data
    const details = {
      price_per_m2:
        listingType === "koop" ? rawDetails["Asking price per m²"] : undefined,
      listed_since: rawDetails["Listed since"],
      status: rawDetails["Status"],
      type_apartment: rawDetails["Type apartment"],
      neighbourhood: rawDetails["Neighborhood"],
      living_area: rawDetails["Living area"],
      number_of_rooms: rawDetails["Number of rooms"],
      located_at: rawDetails["Located at"],
    };

    if (listingType === "huur") {
      delete details.price_per_m2;
    }
    console.log("Details:", details);

    return details;
  } catch (error) {
    console.error("Error scraping listing details:", error);
    throw error;
  }
};

module.exports = {
  listingDetails,
};
