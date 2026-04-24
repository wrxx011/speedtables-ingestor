import { chromium } from "playwright";
import * as cheerio from "cheerio";

export async function scrapeEventTimetable(eventUrl: string) {
  console.log("starting event timetable ingestor");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // set useragent
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    // use url which was passed by the main function
    await page.goto(eventUrl, {
      waitUntil: "domcontentloaded",
    });

    // wait for element to load before scraping
    await page.waitForSelector(".timetable__inner-container");

    // get the html
    const content = await page.content();
    const $ = cheerio.load(content);

    // initialize the schedule array so we can push elements later
    let schedule = [];

    // select the element
    const timetableContainer = $(".timetable__container");

    // iterate over every day
    timetableContainer.each((_, element) => {

      // initialize the sessions array
      let sessions = [];

      // Scope the search to the current element only
      const sessionsContainer = $(element).find(".timetable__table-body tr");

      // for each session
      sessionsContainer.each((_, row) => {
        sessions.push({
          label: $(row).find("td").first().text().trim(),
          localTime: $(row).find("td").eq(1).text().trim(),
          gmt: $(row).find("td").eq(2).text().trim(),
        });
      });

      // Push the day and its specific sessions to schedule
      schedule.push({
        date: $(element)
          .find("caption.timetable__caption")
          .first()
          .text()
          .trim(),
        sessions: sessions,
      });
    });

    console.log(
      `Successfully scraped ${schedule.length} days from ${eventUrl}.`,
    );

    // get the id so we can save each event under a different day
    const id = eventUrl.match(/\d+/);

    // save to json file
    await Bun.write(
      `./data/schedule-${id}.json`,
      JSON.stringify(schedule, null, 2),
    );
    console.log(`Data saved to schedule-${id}.json`);

    // return data to main function
    return schedule;
  } catch (error) {
    console.error("Error scraping site:", error);
  } finally {
    await browser.close();
  }
}
