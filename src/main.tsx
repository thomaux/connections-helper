import React from 'react';
import { Board } from './components/board/board.tsx';
import { Toolbar } from './components/toolbar/toolbar.tsx';
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

const root = document.createElement("div");
root.classList.add('app');
document.body.appendChild(root);

createRoot(root).render(
<Provider store={store}>
    <Board />
    <Toolbar />
</Provider>,
);