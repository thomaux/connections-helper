import puppeteer from "puppeteer";
import { Board } from "../components/board/board";
import StoreProvider from "./storeProvider";
import { Toolbar } from "../components/toolbar/toolbar";
import "./assets/styles/global.scss";

const CONNECTIONS_URL = "https://www.nytimes.com/games/connections";

export default async function Page() {
  try {
    const words = await getWords();

    return (
      <StoreProvider words={words}>
        <Board />
        <Toolbar />
      </StoreProvider>
    );
  } catch (err) {
    return <h1>Error: {err.message}</h1>;
  }
}

async function getWords() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(CONNECTIONS_URL, { waitUntil: "networkidle0" });

  // Reject cookies
  await page.click(".fides-reject-all-button");

  // Accept terms
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.click(".purr-blocker-card__button");

  // Start game
  await new Promise((resolve) => setTimeout(resolve, 1000));
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
