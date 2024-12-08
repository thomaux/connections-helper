import cn from 'classnames';
import React from 'react';
import { NamedColor } from '../../lib/features/word/named-color';
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
            [styles.Yellow]: colors.includes(NamedColor.YELLOW),
            [styles.Blue]: colors.includes(NamedColor.BLUE),
            [styles.Green]: colors.includes(NamedColor.GREEN),
            [styles.Purple]: colors.includes(NamedColor.PURPLE),
        })} onClick={onClick}>{children}</button>
    );
}