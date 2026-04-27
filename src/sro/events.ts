import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { scrapeEventTimetable } from "./session";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function scrapeGTWCSchedule() {
  console.log("starting ingestor");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // set useragent
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    // use calendar endpoint
    await page.goto("https://www.gt-world-challenge-europe.com/calendar", {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    // wait for element to load before scraping
    await page.waitForSelector(".calendar__list-items", { timeout: 30_000 });

    // get the html
    const content = await page.content();
    const $ = cheerio.load(content);

    let events = [];

    // select the element
    const futureEventsContainer = $("li.calendar__list-item");

    // iterate over all elements
    for (const element of futureEventsContainer.toArray()) {
      // check if the element has an class of full-width
      // this ensures the first element which is always wide gets a valid url
      let url = "";
      if ($(element).hasClass("full-width")) {
        url =
          "https://www.gt-world-challenge-europe.com" +
          $(element).find(".link-button").attr("href");
      } else {
        url =
          "https://www.gt-world-challenge-europe.com" +
          $(element).find(".calendar__footer-list-link").attr("href");
      }

      await sleep(2500);
      const eventData = await scrapeEventTimetable(url);

      // construct an object of properties extracted from the DOM
      events.push({
        header: $(element).find(".calendar__race-header").text().trim(),
        round: $(element).find(".calendar__race-text").first().text().trim(),
        series: $(element).find(".calendar__race-text").last().text().trim(),
        url: url,
        circuitUrl: eventData[0].trackUrl,
        sessions: eventData[1],
        id: $(element)
          .find(".calendar__footer-list-link")
          .attr("href")
          ?.match(/\d+/),
      });
    }

    console.log(`Successfully scraped ${events.length} events.`);

    // save to json file
    await Bun.write("./data/events.json", JSON.stringify(events, null, 2));
    return events;
  } catch (error) {
    console.error("Error scraping site:", error);
  } finally {
    await browser.close();
  }
}
