import chrome from '@sparticuz/chromium';
import puppeteer, { ElementHandle } from 'puppeteer-core';

async function scrape(url: string) {
  const options = process.env.NODE_ENV === 'production'
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath(),
        headless: true
      }
    : {
        args: [],
        executablePath:
          process.platform === 'win32'
            ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            : process.platform === 'linux'
            ? '/usr/bin/google-chrome'
            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

   // Reject cookies
   await page.waitForSelector(".fides-reject-all-button");
   const rejectCookieButton$ = (await page.$$(".fides-reject-all-button"))[0];
   await rejectCookieButton$.evaluate((el) => (el as HTMLButtonElement).click());

  //  // Accept terms
  //  await new Promise((resolve) => setTimeout(resolve, 1000));
  //  await page.click(".purr-blocker-card__button");
 
   // Start game
  //  await new Promise((resolve) => setTimeout(resolve, 1000));
   await page.click('button[data-testid="moment-btn-play"]');

   await page.screenshot({
    path: 'hn.png',
  });
 
   await page.waitForSelector("#default-choices");
   const items$ = await page.$$("#default-choices label");
 
   if (items$.length !== 16) {
     throw new Error(
       `Failed to find all 16 words on the board. Found ${items$.length} word(s).`
     );
   }
 
   const textContents = await Promise.all(
     items$.map((item$) => item$.evaluate((item) => item.textContent))
   );
 
   await browser.close();
 
   return textContents;
}

try {
  await scrape("https://www.nytimes.com/games/connections");
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}