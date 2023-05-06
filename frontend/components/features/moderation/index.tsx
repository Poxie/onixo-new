import styles from '../Features.module.scss';
import { FeatureTiles } from "../FeatureTiles"
import allTiles from '@/assets/json/FeatureTiles.json';

const tiles = allTiles.find(tile => tile.id === 'moderation')?.tiles || [];

export const Moderation = () => {
    return(
        <div className={styles['feature-content']}>
            <FeatureTiles 
                tiles={tiles}
            />
        </div>
    )
}