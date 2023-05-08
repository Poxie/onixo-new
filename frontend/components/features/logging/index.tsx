import styles from '../Features.module.scss';
import { FeatureTiles } from "../FeatureTiles"
import allTiles from '@/assets/json/FeatureTiles.json';

const tiles = allTiles.find(tile => tile.id === 'logging')?.tiles || [];

export const Logging = () => {
    return(
        <div className={styles['feature-content']}>
            <FeatureTiles 
                tiles={tiles}
            />
        </div>
    )
}