const puppeteer = require("puppeteer");

const scrapeListings = async (url) => {
  console.log("Scraping listings for URL:", url);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const listings = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll(".search-result"));

    return elements.map((element) => {
      const image = element?.querySelector(".search-result-image img")?.src;
      const title = element
        ?.querySelector(".search-result__header-title")
        ?.textContent.trim();
      const linkElement = element.querySelector(
        ".search-result-main a[data-object-url-tracking='resultlist']"
      );
      const url = linkElement?.getAttribute("href")?.replace(/(\?.*)$/, "");
      const price = element
        ?.querySelector(".search-result-price")
        ?.textContent.trim();
      const details = Array.from(
        element?.querySelectorAll(".search-result-kenmerken li")
      ).map((li) => li.textContent.trim());

      return {
        image,
        title,
        url: `https://www.funda.nl${url}`, // Add base URL to the scraped URL
        price,
        details,
      };
    });
  });

  await browser.close();

  listings.forEach((listing) => {
    console.log("Listing URL:", listing.url);
  });

  return listings;
};

module.exports = {
  scrapeListings,
};
