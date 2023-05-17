import styles from './ItemList.module.scss'
import { useGuildId } from "@/hooks/useGuildId"
import { selectGuildChannelIds } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { ListItem } from "./ListItem";
import { useEffect, useRef, useState } from "react";
import { SelectedItem } from './SelectedItem';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';

export const ItemList: React.FC<{
    onChange?: (itemId: string | null) => void;
    defaultActive?: string;
    loading?: boolean;
}> = ({ defaultActive=null, onChange, loading=false }) => {
    const guildId = useGuildId();
    const channelIds = useAppSelector(state => selectGuildChannelIds(state, guildId));

    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(defaultActive);
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => setActiveId(defaultActive), [defaultActive]);

    const handleChange = (itemId: string | null, e: React.MouseEvent) => {
        setOpen(false);
        setActiveId(itemId)
        onChange && onChange(itemId);
    }
    const handleClick = (e: React.MouseEvent) => {
        // Checks if click is on selected item item, if so return
        if(e.currentTarget.contains(ref.current)) return;

        setOpen(prev => !prev);
    }

    const className = [
        styles['container'],
        open ? styles['expanded'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <div className={styles['selected']}>
                <button 
                    className={styles['selected-button']}
                    onClick={handleClick}
                    disabled={loading}
                    aria-label="Select channhels"
                />
                <div className={styles['selected-main']}>
                    {loading ? (
                        <div className={styles['loading']} />
                    ) : (
                        activeId ? (
                            <SelectedItem 
                                id={activeId}
                                guildId={guildId}
                                onClick={e => handleChange(null, e)}
                                ref={ref}
                            />
                        ) : (
                            <span>
                                No channel selected.
                            </span>
                        )
                    )}
                </div>
                <ArrowIcon />
            </div>
            {open && (
                <ul className={styles['items']}>
                    {channelIds?.map(channelId => (
                        <ListItem 
                            id={channelId}
                            guildId={guildId}
                            onClick={handleChange}
                            key={channelId}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}