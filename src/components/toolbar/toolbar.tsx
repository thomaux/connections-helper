"use client";
import { resetBoard, setActiveColor } from "../../lib/features/word/helperSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import styles from "./toolbar.module.scss";
import cn from "classnames";

export function Toolbar() {
  const colors = useAppSelector(({ helper }) => helper.colors);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.Toolbar}>
      {colors.map(({ name, colorState }) => (
        <button
          key={name}
          className={cn(styles.Button, {
            [styles.Active]: colorState === "active",
          })}
          onClick={() => dispatch(setActiveColor({ color: name }))}
        >
          {name}
        </button>
      ))}
      <button className={styles.Button} onClick={() => dispatch(resetBoard())}>clear</button>
    </div>
  );
}
