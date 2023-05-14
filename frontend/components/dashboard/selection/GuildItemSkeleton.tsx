import styles from './Selection.module.scss';

export const GuildItemSkeleton = () => {
    return(
        <li className={styles['guild-item']}>
            <div className={styles['guild-item-banner']} />
            <div className={styles['guild-item-text']}>
                <div className={styles['guild-item-icon']} />
                <div className={styles['text-placeholder']} />
                <div className={styles['button-placeholder']} />
            </div>
        </li>
    )
}