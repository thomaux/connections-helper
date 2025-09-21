import React from "react";

import { Board } from "../board/board.tsx";
import { Toolbar } from "../toolbar/toolbar.tsx";
import { Provider } from "react-redux";
import { store } from "../../store/store.ts";
import styles from "./app.module.scss";

export function App() {
  return (
    <div className={styles.App}>
      <Provider store={store}>
        <Board />
        <Toolbar />
      </Provider>
    </div>
  );
}
