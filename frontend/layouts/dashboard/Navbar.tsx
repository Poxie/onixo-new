import Link from 'next/link';
import styles from './DashboardLayout.module.scss';
import { OnixoBannerIcon } from '@/assets/icons/OnixoBannerIcon';
import { useAuth } from '@/contexts/auth';
import Image from 'next/image';
import { getUserAvatar } from '@/utils/getImages';
import { useRef } from 'react';
import { useNavbarMenu } from '@/hooks/useNavbarMenu';
import Button from '@/components/button';
import { useGuildId } from '@/hooks/useGuildId';

export const Navbar = () => {
    const guildId = useGuildId();
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
                <div className={styles['options']}>
                    <Button 
                        className={styles['button']}
                        href={`/dashboard/${guildId}/premium`}
                    >
                        Get Premium
                    </Button>
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
                </div>
            )}
        </div>
    )
}