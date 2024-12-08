'use client'
import { useAppSelector } from '../../lib/hooks';
import { Cell } from '../cell/cell';
import styles from './board.module.scss';

export function Board() {
    const words = useAppSelector((state) => state.helper.words);
    return (
        <div className={styles.Board}>
            {words.map((word) => (
                <Cell key={word.value} word={word.value} colors={word.colors} />
            ))}
        </div>
    );
}