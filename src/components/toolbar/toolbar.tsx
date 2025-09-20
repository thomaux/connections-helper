import React from "react";
import cn from "classnames";
import {
  cleanColor,
  lockColor,
  resetBoard,
  setActiveColor,
  unlockColor,
} from "../../store/features/helper/helperSlice.ts";
import { Button } from "../button/button.tsx";
import styles from "./toolbar.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import type { RootState } from "../../store/store.ts";

function selectToolbarColors(state: RootState) {
  return state.helper.colors.map(({ name, colorState }) => {
    const wordCount = state.helper.words.filter((word) =>
      word.colors.includes(name)
    ).length;
    return {
      name,
      colorState,
      isLockable: colorState !== "locked" && wordCount === 4,
      isCleanable: colorState !== "locked" && wordCount > 0,
    };
  });
}

export function Toolbar() {
  const colors = useAppSelector(selectToolbarColors);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.Toolbar}>
      {colors.map(({ name, colorState, isLockable, isCleanable }) => (
        <div key={name} className={styles.ToolbarButtonGroup}>
          <Button
            isDisabled={colorState === "locked"}
            className={cn(styles.ToolbarButton, {
              [styles.Active]: colorState === "active",
              [styles.Locked]: colorState === "locked",
            })}
            colors={[name]}
            onClick={() => dispatch(setActiveColor({ color: name }))}
          />
          {isLockable && (
            <Button
              className={styles.ToolbarButton}
              onClick={() => dispatch(lockColor({ color: name }))}
            >
              🔒
            </Button>
          )}
          {isCleanable && (
            <Button
              className={styles.ToolbarButton}
              onClick={() => dispatch(cleanColor({ color: name }))}
            >
              🧹
            </Button>
          )}
          {colorState === "locked" && (
            <Button
              className={styles.ToolbarButton}
              onClick={() => dispatch(unlockColor({ color: name }))}
            >
              🔑
            </Button>
          )}
        </div>
      ))}
      <div className={styles.ToolbarButtonGroup}>
        <Button
          className={styles.ToolbarButton}
          onClick={() => dispatch(resetBoard())}
        >
          ♻️
        </Button>
      </div>
    </div>
  );
}
