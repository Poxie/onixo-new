import styles from './Home.module.scss';
import tiles from '@/assets/json/HomeTiles.json';
import { Tile } from "./Tile";

export type TileType = typeof tiles[0];

export const Tiles = () => (
    <section>
        <ul className={styles['tiles']}>
            {tiles.map((tile, key) => (
                <Tile 
                    {...tile}
                    reversed={key % 2 !== 0}
                    key={tile.title} 
                />
            ))}
        </ul>
    </section>
)