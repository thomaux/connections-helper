import React from 'react';
import cn from "classnames";
import { lockColor, resetBoard, setActiveColor, unlockColor } from "../../store/features/helper/helperSlice.ts";
import { Button } from '../button/button.tsx';
import styles from "./toolbar.module.scss";
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';

export function Toolbar() {
  const colors =  useAppSelector(({ helper }) => helper.colors.map(({ name, colorState }) => ({ 
    name, 
    colorState,
    isLockable: colorState !== "locked" && helper.words.filter((word) => word.colors.includes(name)).length === 4 })
  ));
  const dispatch = useAppDispatch();

  return (
    <div className={styles.Toolbar}>
      {colors.map(({ name, colorState, isLockable }) => (
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
            className={cn(styles.ToolbarButton, styles.Locker)}
            onClick={() => dispatch(lockColor({ color: name }))}
            >🔒</Button>
          )}
        {colorState === "locked" && (
          <Button
            className={cn(styles.ToolbarButton, styles.Locker)}
            onClick={() => dispatch(unlockColor({ color: name }))}
          >🔑</Button>
        )}
        </div>
      ))}
      <div className={styles.ToolbarButtonGroup}>
      <Button className={styles.ToolbarButton} onClick={() => dispatch(resetBoard())}>clear</Button>
      </div>
    </div>
  );
}
