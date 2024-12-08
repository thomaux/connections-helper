import { toggleActiveColor } from '../../lib/features/word/helperSlice';
import { NamedColor } from '../../lib/features/word/named-color';
import { useAppDispatch } from '../../lib/hooks';
import styles from './cell.module.scss';
import cn from 'classnames';

type CellProps = {
    word: string;
    colors: NamedColor[];
};

export function Cell({ word, colors }: CellProps) {
    const dispatch = useAppDispatch();

    return (
        <button className={cn(styles.Cell, {
            [styles.Yellow]: colors.includes(NamedColor.YELLOW),
            [styles.Blue]: colors.includes(NamedColor.BLUE),
            [styles.Green]: colors.includes(NamedColor.GREEN),
            [styles.Purple]: colors.includes(NamedColor.PURPLE),
        })} onClick={() => dispatch(toggleActiveColor({ word }))}>{word}</button>
    );
}