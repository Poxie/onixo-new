import styles from './Infractions.module.scss';
import { DashAuthLayout } from "@/layouts/dash-auth";
import { DashboardLayout } from "@/layouts/dashboard";
import { NextPageWithLayout } from "@/pages/_app";
import { ModuleHeader } from "../module-header";
import { useEffect, useMemo, useState } from "react";
import { useGuildId } from "@/hooks/useGuildId";
import { useAuth } from "@/contexts/auth";
import { Infraction as InfractionType } from "@/types";
import { Infraction } from './Infraction';
import { Input } from '@/components/input';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectInfractions } from '@/redux/dashboard/selectors';
import { setInfractions } from '@/redux/dashboard/actions';
import { Dropdown } from '@/components/dropdown';

const ACTION_FILTERS = [
    { text: 'Ban', id: 'ban' },
    { text: 'Kick', id: 'kick' },
    { text: 'Mute', id: 'mute' },
    { text: 'Warn', id: 'warn' },
]

const PLACEHOLDER_COUNT = 8;
export const Infractions: NextPageWithLayout = () => {
    const dispatch = useAppDispatch();
    const guildId = useGuildId();
    const { get, token } = useAuth();

    const [search, setSearch] = useState('');
    const [action, setAction] = useState<string | null>(null);

    const infractions = useAppSelector(state => selectInfractions(state, guildId));
    
    useEffect(() => {
        if(!token || !guildId) return;

        get<InfractionType[]>(`/guilds/${guildId}/infractions`, 'backend')
            .then(infractions => {
                dispatch(setInfractions(guildId, infractions));
            });
    }, [token, get, guildId]);
    
    const filteredInfractions = useMemo(() => (
        infractions?.filter(infraction => {
            return(
                (search !== '' ? (
                    infraction.reason?.toLowerCase().includes(search.toLowerCase()) ||
                    infraction.target.global_name.toLowerCase().includes(search.toLowerCase()) ||
                    infraction.issuer.global_name.toLowerCase().includes(search.toLowerCase())
                ) : true) &&
                (action ? (
                    infraction.action === action
                ) : true
            ))
        })
    ), [search, action, infractions?.length])
    return(
        <>
        <ModuleHeader 
            header={'Infractions'}
            subHeader={'View your server\'s infractions right here on the dashboard.'}
        />
        <div className={styles['filters']}>
            <span className={styles['label']}>
                Filters
            </span>
            <div className={styles['flex']}>
                <Dropdown 
                    placeholder={'Filter by action'}
                    items={ACTION_FILTERS}
                    onChange={setAction}
                    active={action}
                />
            </div>
            <Input 
                placeholder={'Search'}
                onChange={setSearch}
            />
        </div>
        {filteredInfractions && filteredInfractions?.length !== 0 && (
            <span className={styles['label']}>
                Showing {filteredInfractions?.length} infractions
            </span>
        )}
        {filteredInfractions?.length === 0 && (
            <span className={styles['label']}>
                No infractions were found.
            </span>
        )}
        {filteredInfractions?.length !== 0 && (
            <ul className={styles['list']}>
                {filteredInfractions?.map(infraction => (
                    <Infraction 
                        {...infraction}
                        key={infraction._id}
                    />
                ))}
            </ul>
        )}
        
        {/* Loading states */}
        {!filteredInfractions && (
            <>
            <div className={styles['text-skeleton']} />
            <div className={styles['list']}>
                {Array.from(Array(PLACEHOLDER_COUNT)).map((_, key) => (
                    <div className={`${styles['item']} ${styles['item-skeleton']}`} />
                ))}
            </div>
            </>
        )}
        </>
    )  
}

Infractions.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)