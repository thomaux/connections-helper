import cn from 'classnames';
import React from 'react';
import type { NamedColor } from '../../types/named-color.ts';
import styles from './button.module.scss';

type ButtonProps = {
    colors?: NamedColor[];
    children?: React.ReactNode;
    onClick: () => void;
    className?: string;
};

export function Button({ colors = [], children = null, onClick, className }: ButtonProps) {
    return (
        <button className={cn(className, styles.Button, {
            [styles.Yellow]: colors.includes('yellow'),
            [styles.Blue]: colors.includes('blue'),
            [styles.Green]: colors.includes('green'),
            [styles.Purple]: colors.includes('purple'),
        })} onClick={onClick}>{children}</button>
    );
}