import React from 'react';
import cn from "classnames";
import { resetBoard, setActiveColor } from "../../store/features/helper/helperSlice.ts";
import { Button } from '../button/button.tsx';
import styles from "./toolbar.module.scss";
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';

export function Toolbar() {
  const colors =  useAppSelector(({ helper }) => helper.colors);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.Toolbar}>
      {colors.map(({ name, colorState }) => (
        <Button
          key={name}
          className={cn(styles.ToolbarButton, {
            [styles.Active]: colorState === "active",
          })}
          colors={[name]}
          onClick={() => dispatch(setActiveColor({ color: name }))}
        />
      ))}
      <Button className={styles.ToolbarButton} onClick={() => dispatch(resetBoard())}>clear</Button>
    </div>
  );
}
