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

  try {
    let consentDialogFound = true;
    while (consentDialogFound) {
      try {
        await page.waitForSelector(
          ".banner-actions-container #onetrust-accept-btn-handler",
          { timeout: 5000 }
        );

        const navigationPromise = page.waitForNavigation();
        await page.click(
          ".banner-actions-container #onetrust-accept-btn-handler"
        );
        await navigationPromise;

        console.log("Accepted cookies");
      } catch (error) {
        consentDialogFound = false;
      }
    }
  } catch (error) {
    console.log("Did not find cookie consent dialog");
  }

  const searchResultItemsExist = await page.evaluate(() => {
    const searchResultItems = document.querySelectorAll(
      '[data-test-id="search-result-item"]'
    );
    return searchResultItems.length > 0;
  });

  if (searchResultItemsExist) {
    let rawListings;
    try {
      rawListings = await page.evaluate(() => {
        const extractListingDetails = (element) => {
          const imageElement = element?.querySelector("img");
          const imageSrcSet = imageElement?.getAttribute("srcset");
          const image = imageSrcSet
            ? imageSrcSet.match(/https:\/\/[^\s]+.jpg/g)?.pop()
            : null;

          const titleElement = element.querySelector(
            'h2[data-test-id="street-name-house-number"]'
          );
          const title = titleElement?.textContent.trim();

          const linkElement = titleElement?.closest("a");
          const url = linkElement?.getAttribute("href")?.replace(/(\?.*)$/, "");

          const postal_code = element
            ?.querySelector('div[data-test-id="postal-code-city"]')
            ?.textContent.trim();

          let price = "";
          const rentPriceElement = element?.querySelector(
            'p[data-test-id="price-rent"]'
          );
          const salePriceElement = element?.querySelector(
            'p[data-test-id="price-sale"]'
          );
          if (rentPriceElement) {
            price = rentPriceElement.textContent
              .trim()
              .replace(/\s*p\/mo\.\s*$/, "");
          } else if (salePriceElement) {
            price = salePriceElement.textContent.trim() || "";
            price = price.replace(/\s*k\.k\.\s*$/, "");
          }

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

        const elements = Array.from(
          document.querySelectorAll('[data-test-id="search-result-item"]')
        );

        return elements.map(extractListingDetails);
      });
    } catch (error) {
      console.error("⛔ Error during page evaluation:", error);
    }

    return rawListings;
  } else {
    console.log("No search result items found.");
    return [];
  }
};

module.exports = { fetchAndExtractListings };
