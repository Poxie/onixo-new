import styles from './Automod.module.scss';

export const LinkPresetItemSkeleton = () => (
    <div className={`${styles['preset-item']} ${styles['preset-item-skeleton']}`}>
        <div className={styles['skeleton-text']} />
        <div className={styles['skeleton-button']} />
    </div>
)