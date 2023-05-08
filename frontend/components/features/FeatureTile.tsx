import { useRef } from 'react';
import styles from './Features.module.scss';
import { Tile } from "./FeatureTiles";
import { useWithinView } from '@/hooks/useWithinView';
import { getTileImage } from '@/utils/getTileImage';

export const FeatureTile: React.FC<Tile & {
    reversed: boolean;
    index: number;
    id: string;
}> = ({ id, title, text, index, reversed }) => {
    const ref = useRef<HTMLLIElement>(null);
    
    const visible = useWithinView(ref);

    const className = [
        styles['tile'],
        reversed ? styles['reversed'] : '',
        !visible ? styles['hidden'] : ''
    ].join(' ');
    return(
        <li className={className} ref={ref}>
            <div className={styles['tile-text']}>
                <h2>
                    {title}
                </h2>
                <p>
                    {text}
                </p>
            </div>
            {getTileImage(id, index)}
        </li>
    )
}