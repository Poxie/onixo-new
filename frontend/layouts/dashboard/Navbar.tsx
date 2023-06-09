import Link from 'next/link';
import styles from './DashboardLayout.module.scss';
import { OnixoBannerIcon } from '@/assets/icons/OnixoBannerIcon';
import { useAuth } from '@/contexts/auth';
import Image from 'next/image';
import { getUserAvatar } from '@/utils/getImages';
import { useRef } from 'react';
import { useNavbarMenu } from '@/hooks/useNavbarMenu';

export const Navbar = () => {
    const { user } = useAuth();

    const ref = useRef<HTMLButtonElement>(null);
    const { show: showMenu } = useNavbarMenu(ref);
    
    return(
        <div className={styles['navbar']}>
            <Link 
                className={styles['navbar-icon']}
                href={'/'}
            >
                <OnixoBannerIcon />
            </Link>
            {user && (
                <button 
                    className={styles['navbar-user']}
                    onClick={showMenu}
                    ref={ref}
                >
                    <Image 
                        src={getUserAvatar(user.id, user.avatar)}
                        width={28}
                        height={28}
                        alt=""
                    />
                    {user.global_name}
                </button>
            )}
        </div>
    )
}