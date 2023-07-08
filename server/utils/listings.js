const fetchAndExtractListings = async (page, url) => {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    await page.waitForTimeout(3000);
    await page.waitForSelector("title");
    console.log("Page title:", await page.title());
  } catch (error) {
    console.log("Navigation failed:", error);
  }

  let rawListings;
  try {
    rawListings = await page.evaluate(() => {
      const extractListingDetails = (element) => {
        const image =
          element?.querySelector(".search-result-image img")?.src ||
          element?.querySelector(".promo-thumbnail img")?.src;
        const title = element
          ?.querySelector(".search-result__header-title")
          ?.textContent.trim();
        const linkElement = element.querySelector(
          "a[data-object-url-tracking='resultlist']"
        );
        const url = linkElement?.getAttribute("href")?.replace(/(\?.*)$/, "");
        const postal_code = element
          ?.querySelector(".search-result__header-subtitle")
          ?.textContent.trim();
        const price = (
          element?.querySelector(".search-result-price")?.textContent.trim() ||
          ""
        ).replace(/\s*k\.k\.\s*$/, "");
        const details = Array.from(
          element?.querySelectorAll(".search-result-kenmerken li")
        ).map((li) => li.textContent.trim());

        return {
          image,
          title,
          url:
            url && url.startsWith("https://www.funda.nl")
              ? url
              : `https://www.funda.nl${url}`,
          postal_code,
          price,
          details,
        };
      };

      const elements = Array.from(document.querySelectorAll(".search-result"));
      return elements.map(extractListingDetails);
    });
  } catch (error) {
    console.error("⛔ Error during page evaluation:", error);
  }

  return rawListings;
};

module.exports = { fetchAndExtractListings };
