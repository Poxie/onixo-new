import styles from '../Features.module.scss';
import { FeatureTiles } from "../FeatureTiles"
import allTiles from '@/assets/json/FeatureTiles.json';

const tiles = allTiles.find(tile => tile.id === 'greeting')?.tiles || [];

export const Greeting = () => {
    return(
        <div className={styles['feature-content']}>
            <FeatureTiles 
                tiles={tiles}
            />
        </div>
    )
}