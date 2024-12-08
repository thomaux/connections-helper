import { toggleActiveColor } from '../../lib/features/word/helperSlice';
import { NamedColor } from '../../lib/features/word/named-color';
import { useAppDispatch } from '../../lib/hooks';
import { Button } from '../button/button';
import styles from './cell.module.scss';

type CellProps = {
    word: string;
    colors: NamedColor[];
};

export function Cell({ word, colors }: CellProps) {
    const dispatch = useAppDispatch();

    return (
        <Button className={styles.Cell} colors={colors} onClick={() => dispatch(toggleActiveColor({ word }))}>{word}</Button>
    );
}