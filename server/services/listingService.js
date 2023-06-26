require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const useProxy = require("puppeteer-page-proxy");
const { listingDetails } = require("./listingDetails");

puppeteer.use(StealthPlugin());

const scrapeListings = async (url, listingType) => {
  console.log("Scraping listings for URL:", url);

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      slowMo: 500,
      args: [
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        // `--proxy-server=${process.env.PROXY}`,
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    page.on("console", (msg) => {
      for (let i = 0; i < msg.args().length; ++i) {
        console.log(`${i}: ${msg.args()[i]}`);
      }
    });

    await page.setViewport({ width: 1080, height: 1024 });

    let currentPage = 1;
    const allListings = [];

    await useProxy(page, process.env.PROXY);

    const data = await useProxy.lookup(page);
    console.log("Page IP:", data.ip);

    while (true) {
      console.log("Scraping page:", currentPage);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Wait for the title element to appear
      await page.waitForSelector("title");

      // Extract the page title
      const title = await page.title();
      console.log("Page Title:", title);

      // Fetch promo listings
      const promoListings = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll(".search-result-main-promo")
        );

        return elements.map((element) => {
          const image = element?.querySelector(".promo-thumbnail img")?.src;
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
            element
              ?.querySelector(".search-result-price")
              ?.textContent.trim() || ""
          ).replace(/\s*k\.k\.\s*$/, "");

          return {
            image,
            title,
            url:
              url && url.startsWith("https://www.funda.nl")
                ? url
                : `https://www.funda.nl${url}`,
            postal_code,
            price,
          };
        });
      });

      const regularListings = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll(".search-result")
        );

        return elements
          .filter(
            (element) => !element.querySelector(".search-result-main-promo")
          )
          .map((element) => {
            const image = element?.querySelector(
              ".search-result-image img"
            )?.src;
            const title = element
              ?.querySelector(".search-result__header-title")
              ?.textContent.trim();
            const linkElement = element.querySelector(
              ".search-result-main a[data-object-url-tracking='resultlist']"
            );
            const url = linkElement
              ?.getAttribute("href")
              ?.replace(/(\?.*)$/, "");
            const postal_code = element
              ?.querySelector(".search-result__header-subtitle")
              ?.textContent.trim();
            const price = (
              element
                ?.querySelector(".search-result-price")
                ?.textContent.trim() || ""
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
          });
      });

      // Merge promo and regular listings
      const listings = [...promoListings, ...regularListings];

      // Scrape details for each listing
      for (let i = 0; i < listings.length; i++) {
        try {
          // Handle errors for individual listings
          const listing = listings[i];
          const details = await listingDetails(page, listing.url, listingType);
          listing.details = details;

          // Add listingType and neighborhood
          listing.listingType = listingType;
          listing.neighbourhood = details.neighbourhood;
        } catch (error) {
          console.error(`Error scraping details for listing ${i}:`, error);
        }
      }

      allListings.push(...listings);

      const nextPageButton = await page.$(
        ".pagination-pages a[aria-current='page'] + a"
      );
      if (!nextPageButton || currentPage >= 28) {
        break;
      }

      const nextPageUrl = await page.evaluate(
        (nextPageButton) => nextPageButton.href,
        nextPageButton
      );
      currentPage++;
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    }

    await browser.close();

    allListings.forEach((listing) => {
      console.log("Listing URL:", listing.url);
    });

    return allListings;
  } catch (error) {
    console.error("Error scraping listings:", error);
    throw error;
  }
};

module.exports = {
  scrapeListings,
};
