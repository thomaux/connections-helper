import React from "react";

import type { NamedColor } from "../../types/named-color.ts";
import { Button } from "../button/button.tsx";
import styles from "./cell.module.scss";
import { useAppDispatch } from "../../store/hooks.ts";
import { toggleActiveColor } from "../../store/features/helper/helperSlice.ts";

type CellProps = {
  word: string;
  colors: NamedColor[];
};

export function Cell({ word, colors }: CellProps) {
  const dispatch = useAppDispatch();

  return (
    <Button
      className={styles.Cell}
      colors={colors}
      onClick={() => dispatch(toggleActiveColor({ word }))}
    >
      {word}
    </Button>
  );
}
