const listingDetails = async (page, url) => {
  console.log("Scraping details for URL:", url);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract the page title
    const title = await page.title();
    console.log("Page Title:", title);

    const rawDetails = await page.evaluate(() => {
      const details = {};
      const dtElements = document.querySelectorAll(".object-kenmerken-list dt");
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

    // Structure the data
    const details = {
      asking_price: rawDetails["Asking price"]
        ? rawDetails["Asking price"].split(" kosten koper")[0]
        : "",
      price_per_m2: rawDetails["Asking price per m²"],
      listed_since: rawDetails["Listed since"],
      status: rawDetails["Status"],
      type_apartment: rawDetails["Type apartment"],
      neighborhood: rawDetails["Neighborhood"],
      layout: {
        living_area: rawDetails["Living area"],
        number_of_rooms: rawDetails["Number of rooms"],
        located_at: rawDetails["Located at"],
      },
    };

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
