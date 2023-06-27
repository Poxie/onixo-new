import styles from './ModerationLayout.module.scss';
import { Chips } from "@/components/chips"
import { useEffect, useInsertionEffect, useState } from 'react';
import { useGuildId } from '@/hooks/useGuildId';
import { ModuleHeader } from '@/components/dashboard/module-header';
import { useRouter } from 'next/router';

const CHIPS = [
    { text: 'Automod', id: 'automod' },
    { text: 'Logging', id: 'logging' },
    { text: 'Settings', id: 'settings' },
]
export const ModerationLayout: React.FC<{
    children: any;
}> = ({ children }) => {
    const router = useRouter();
    const guildId = useGuildId();

    const [activeChip, setActiveChip] = useState(CHIPS[0].id);

    useEffect(() => {
        const chipId = router.pathname.split('/').at(-1) as string;
        setActiveChip(chipId);
    }, [router.pathname]);

    return(
        <>
            <ModuleHeader 
                header="Moderation"
                subHeader="Keep your server clean with our large range of moderation tools."
            />
            <Chips 
                chips={CHIPS}
                basePath={`/dashboard/${guildId}/moderation`}
                onChange={setActiveChip}
                defaultActive={activeChip}
                className={styles['chips']}
            />
            {children}
        </>
    )
}