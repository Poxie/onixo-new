import Link from 'next/link';
import styles from './DashboardLayout.module.scss';
import { OnixoBannerIcon } from '@/assets/icons/OnixoBannerIcon';

export const Navbar = () => {
    return(
        <div className={styles['navbar']}>
            <Link 
                className={styles['navbar-icon']}
                href={'/'}
            >
                <OnixoBannerIcon />
            </Link>
        </div>
    )
}