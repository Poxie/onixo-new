import { useRef } from 'react';
import styles from './Features.module.scss';
import { Tile } from "./FeatureTiles";
import { useWithinView } from '@/hooks/useWithinView';

export const FeatureTile: React.FC<Tile & {
    reversed: boolean;
}> = ({ title, text, image, reversed }) => {
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
            <img src={`/icons/${image}`} alt="" />
        </li>
    )
}