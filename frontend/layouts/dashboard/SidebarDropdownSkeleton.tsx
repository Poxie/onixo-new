import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import styles from './DashboardLayout.module.scss';

export const SidebarDropdownSkeleton = () => (
    <div className={styles['dropdown']}>
        <div className={`${styles['dd-item']} ${styles['dd-selected']}`}>
            <div className={styles['dd-selected-main']}>
                <div className={styles['dd-icon-skeleton']} />
                <div className={styles['dd-text-skeleton']} />
            </div>
            <ArrowIcon />
        </div>
    </div>
)