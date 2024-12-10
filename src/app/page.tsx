import { Board } from "../components/board/board";
import { Toolbar } from "../components/toolbar/toolbar";
import scrape from "../lib/scrape";
import "./assets/styles/global.scss";
import StoreProvider from "./storeProvider";

const CONNECTIONS_URL = "https://www.nytimes.com/games/connections";

export default async function Page() {
  try {
    const words = await scrape(CONNECTIONS_URL);

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
