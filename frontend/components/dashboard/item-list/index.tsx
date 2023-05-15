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
}> = ({ defaultActive=null, onChange }) => {
    const guildId = useGuildId();
    const channelIds = useAppSelector(state => selectGuildChannelIds(state, guildId));

    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(defaultActive);
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => setActiveId(defaultActive), [defaultActive]);

    const handleChange = (itemId: string | null) => {
        setOpen(false);
        setActiveId(itemId)
        onChange && onChange(itemId);
    }

    const className = [
        styles['container'],
        open ? styles['expanded'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <button 
                className={styles['selected']}
                onClick={() => setOpen(!open)}
            >
                <div className={styles['selected-main']}>
                    {activeId ? (
                        <SelectedItem 
                            id={activeId}
                            guildId={guildId}
                            onClick={() => handleChange(null)}
                            ref={ref}
                        />
                    ) : (
                        <span>
                            No channel selected.
                        </span>
                    )}
                </div>
                <ArrowIcon />
            </button>
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