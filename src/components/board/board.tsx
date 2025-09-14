import { Cell } from '../cell/cell.tsx';
import styles from './board.module.scss';
import React from 'react';

export function Board() {
    const words = []; // useAppSelector((state) => state.helper.words);
    return (
        <div className={styles.Board}>
            {words.map((word) => (
                <Cell key={word.value} word={word.value} colors={word.colors} />
            ))}
        </div>
    );
}