const puppeteer = require("puppeteer");
const jsdom = require("jsdom");

const scrapeListings = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const htmlString = await page.content();
  const dom = new jsdom.JSDOM(htmlString);
  const result = dom.window.document.querySelectorAll(".search-result");

  const listings = [];
  for (const element of result) {
    const href = element?.querySelectorAll("a")?.[0]?.href;
    listings.push(href);
  }

  await browser.close();

  return listings;
};

module.exports = {
  scrapeListings,
};
