import styles from './Home.module.scss';
import { TileType } from './Tiles';

export const Tile: React.FC<TileType & {
    reversed: boolean;
}> = ({ title, text, icon, boldIndices, reversed }) => {
    const newTitle = title.split(' ').map((part, index) => {
        if(boldIndices.includes(index)) return <span className="highlight">{part}</span>;
        return part + ' ';
    })

    const className = [
        styles['tile'],
        reversed ? styles['reversed'] : ''
    ].join(' ');
    return(
        <li className={className}>
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