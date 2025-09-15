import chrome from '@sparticuz/chromium';
import { writeFile } from 'fs/promises';
import puppeteer from 'puppeteer-core';

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
   const rejectCookieButtons$ = await page.$$(".fides-reject-all-button");
   await Promise.all(rejectCookieButtons$.map((button) => button.evaluate((el) => (el as HTMLButtonElement).click())));
 
   // Start game
   await page.click('button[data-testid="moment-btn-play"]');
   
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
  const words = await scrape("https://www.nytimes.com/games/connections");
  await writeFile(".env", `VITE_WORDS=${words.join(",")}`);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}