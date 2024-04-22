const { app, HttpRequest, HttpResponseInit, InvocationContext } = require("@azure/functions");
const puppeteer = require('puppeteer');

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

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        const items = await getItems();
        context.res = { body: JSON.stringify(items), status: 200, headers: { 'Content-Type': 'application/json' } };
    } catch (error) {
        context.res = { body: error.message, status: 500 };
    }

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };
}