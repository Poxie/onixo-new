import styles from './DashboardLayout.module.scss';
import { useScreenSizes } from '@/hooks/useScreenSizes';
import { SidebarDropdown } from './SidebarDropdown';
import { SidebarTabs } from './SidebarTabs';
import { HamIcon } from '@/assets/icons/HamIcon';
import { OnixoBannerIcon } from '@/assets/icons/OnixoBannerIcon';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const Sidebar: React.FC<{
    open: boolean;
    setOpen: (state: boolean) => void;
}> = ({ open, setOpen }) => {
    const router = useRouter();
    const screenSize = useScreenSizes();
    
    const toggleOpen = () => setOpen(!open);

    useEffect(() => {
        setOpen(false);
    }, [router.asPath]);

    const className = [
        styles['sidebar-collapse'],
        open ? styles['open'] : ''
    ].join(' ');
    return(
        <div className={styles['sidebar']}>
            <SidebarDropdown />
            <div className={className}>
                {screenSize === 'phone' && (
                    <div className={styles['mobile-header']}>
                        <button     
                            className={styles['ham-button']}
                            onClick={() => setOpen(false)}
                        >
                            <HamIcon />
                        </button>
                        <Link href={'/'}>
                            <OnixoBannerIcon />
                        </Link>
                    </div>
                )}
                <SidebarTabs />
            </div>
        </div>
    )
}