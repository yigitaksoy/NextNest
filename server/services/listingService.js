require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const useProxy = require("puppeteer-page-proxy");
const { listingDetails } = require("./listingDetails");

puppeteer.use(StealthPlugin());

const scrapeListings = async (url) => {
  console.log("Scraping listings for URL:", url);

  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        `--proxy-server=${process.env.PROXY}`,
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

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

      const listings = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll(".search-result")
        );

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
            url:
              url && url.startsWith("https://www.funda.nl")
                ? url
                : `https://www.funda.nl${url}`,
            price,
            details,
          };
        });
      });

      // Scrape details for each listing
      for (let i = 0; i < listings.length; i++) {
        try {
          // Handle errors for individual listings
          const listing = listings[i];
          const details = await listingDetails(page, listing.url);
          listing.features = details;
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
      await page.waitForNavigation({ waitUntil: "domcontentloaded" }); // use networkidle2
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
