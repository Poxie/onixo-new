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
import { useAppSelector } from '@/redux/store';
import { useScreenSizes } from '@/hooks/useScreenSizes';
import { HamIcon } from '@/assets/icons/HamIcon';
import { selectGuildById } from '@/redux/slices/dashboard';

export const Navbar: React.FC<{
    setOpen: (state: boolean) => void;
}> = ({ setOpen }) => {
    const screenSize = useScreenSizes();
    const guildId = useGuildId();
    const { user } = useAuth();

    const ref = useRef<HTMLButtonElement>(null);
    const { show: showMenu } = useNavbarMenu(ref);

    const guild = useAppSelector(state => selectGuildById(state, guildId));
    
    return(
        <div className={styles['navbar']}>
            <div className={styles['navbar-main']}>
                {screenSize === 'phone' && (
                    <button 
                        className={styles['ham-button']}
                        onClick={() => setOpen(true)}
                    >
                        <HamIcon />
                    </button>
                )}
                <Link 
                    className={styles['navbar-icon']}
                    href={'/'}
                >
                    <OnixoBannerIcon />
                </Link>
            </div>
            {user && (
                <div className={styles['options']}>
                    {!guild?.premium && (
                        <Button 
                            className={styles['button']}
                            href={`/dashboard/${guildId}/premium`}
                        >
                            Get Premium
                        </Button>
                    )}
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