import { useRef } from 'react';
import styles from './Home.module.scss';
import { TileType } from './Tiles';
import { useWithinView } from '@/hooks/useWithinView';

export const Tile: React.FC<TileType & {
    reversed: boolean;
}> = ({ title, text, icon, boldIndices, reversed }) => {
    const ref = useRef<HTMLLIElement>(null);
    const visible = useWithinView(ref);

    const newTitle = title.split(' ').map((part, index) => {
        if(boldIndices.includes(index)) return <span className="highlight" key={index}>{part}</span>;
        return part + ' ';
    })

    const className = [
        styles['tile'],
        reversed ? styles['reversed'] : '',
        !visible ? styles['hidden'] : ''
    ].join(' ');
    return(
        <li className={className} ref={ref}>
            <div className={styles['tile-text']}>
                <h2>
                    {newTitle}
                </h2>
                <p>
                    {text}
                </p>
            </div>

            <img src={`/icons/${icon}`} alt="" />
        </li>
    )
}