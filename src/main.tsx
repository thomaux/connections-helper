import React from 'react';
import { Board } from './components/board/board.tsx';
import { Toolbar } from './components/toolbar/toolbar.tsx';
import { createRoot } from "react-dom/client";

const root = document.createElement("div");
document.body.appendChild(root);

createRoot(root).render(<>
  <Board />
  <Toolbar />
</>);