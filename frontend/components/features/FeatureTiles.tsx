import styles from './Features.module.scss';
import { FeatureTile } from "./FeatureTile";

export type Tile = {
    title: string;
    text: string;
    image: string;
}

export const FeatureTiles: React.FC<{
    tiles: Tile[];
}> = ({ tiles }) => {
    return(
        <section>
            <ul className={styles['tiles']}>
                {tiles.map((tile, index) => (
                    <FeatureTile 
                        {...tile}
                        reversed={index % 2 !== 0}
                        key={tile.title}
                    />
                ))}
            </ul>
        </section>
    )
}