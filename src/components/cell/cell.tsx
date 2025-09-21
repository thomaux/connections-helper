import React from "react";

import type { NamedColor } from "../../types/named-color.ts";
import { Button } from "../button/button.tsx";
import styles from "./cell.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { toggleActiveColor } from "../../store/features/helper/helperSlice.ts";
import type { RootState } from '../../store/store.ts';

type CellProps = {
  word: string;
  colors: NamedColor[];
};

function selectColorsState({ helper }: RootState) {
  return {
    hasActiveColor: helper.colors.some(color => color.colorState === 'active'),
    lockedColors: helper.colors.filter(color => color.colorState === 'locked').map(color => color.name),
  }
}

export function Cell({ word, colors }: CellProps) {
  const { hasActiveColor, lockedColors } = useAppSelector(selectColorsState);
  const hasLockedColor = colors.some(color => lockedColors.includes(color));
  const dispatch = useAppDispatch();

  return (
    <Button
      className={styles.Cell}
      colors={colors}
      onClick={() => dispatch(toggleActiveColor({ word }))}
      isDisabled={!hasActiveColor || hasLockedColor}
    >
      {word}
    </Button>
  );
}
