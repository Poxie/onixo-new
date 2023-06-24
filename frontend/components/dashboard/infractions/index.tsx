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

export const Infractions: NextPageWithLayout = () => {
    const guildId = useGuildId();
    const { get, token } = useAuth();

    const [infractions, setInfractions] = useState<InfractionType[] | undefined>(undefined);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        if(!token || !guildId) return;

        get<InfractionType[]>(`/guilds/${guildId}/infractions`, 'backend')
            .then(setInfractions);
    }, [token, get, guildId]);
    
    const filteredInfractions = useMemo(() => (
        infractions?.filter(infraction => {
            if(!search) return infraction;
            return(
                infraction.reason?.toLowerCase().includes(search.toLowerCase()) ||
                infraction.target.global_name.toLowerCase().includes(search.toLowerCase()) ||
                infraction.issuer.global_name.toLowerCase().includes(search.toLowerCase())
            ) 
        })
    ), [search])
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
            <Input 
                placeholder={'Search'}
                onChange={setSearch}
            />
        </div>
        {filteredInfractions?.length !== 0 && (
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