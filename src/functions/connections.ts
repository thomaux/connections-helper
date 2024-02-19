import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as puppeteer from 'puppeteer';
import { renderFile } from 'ejs';

const CONNECTIONS_URL = 'https://www.nytimes.com/games/connections';

async function getItems() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(CONNECTIONS_URL);

    // Fetch board
    const items$ = await page.$$('#pz-game-root label');

    if (items$.length !== 16) {
        throw new Error(`Failed to find all 16 words on the board. Found ${items$.length} word(s).`);
    }

    const textContents = await Promise.all(items$.map((item$) => item$.evaluate((item) => item.textContent)));

    await browser.close();

    return textContents;
}

export async function connections(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    context.log(__dirname);

    try {
        const items = await getItems();
        return { body: await renderFile(`${__dirname}/index.ejs`, { items }), status: 200, headers: { 'Content-Type': 'text/html' } };
    } catch (error) {
        return { body: error.message, status: 500 };
    }
};

app.http('connections', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: connections
});
