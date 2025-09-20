import { Cell } from "../cell/cell.tsx";
import styles from "./board.module.scss";
import React from "react";
import { useAppSelector } from "../../store/hooks.ts";
import { selectWordsOrderedByLockedColors } from "../../store/features/helper/helperSlice.ts";

export function Board() {
  const words = useAppSelector(selectWordsOrderedByLockedColors);
  return (
    <div className={styles.Board}>
      {words.map((word) => (
        <Cell key={word.value} word={word.value} colors={word.colors} />
      ))}
    </div>
  );
}
