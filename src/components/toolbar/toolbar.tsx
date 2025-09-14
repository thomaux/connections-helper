import React from 'react';
import cn from "classnames";
import { resetBoard, setActiveColor } from "../../lib/features/word/helperSlice.ts";
import { Button } from '../button/button.tsx';
import styles from "./toolbar.module.scss";

export function Toolbar() {
  const colors = []; // useAppSelector(({ helper }) => helper.colors);
  const dispatch = (props: unknown) => {}

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
