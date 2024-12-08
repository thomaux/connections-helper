"use client";
import cn from "classnames";
import { resetBoard, setActiveColor } from "../../lib/features/word/helperSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { Button } from '../button/button';
import styles from "./toolbar.module.scss";

export function Toolbar() {
  const colors = useAppSelector(({ helper }) => helper.colors);
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
