import styles from './RoleList.module.scss'
import { useGuildId } from "@/hooks/useGuildId"
import { selectGuildRoleIds } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { useModuleSection } from '../module-section';
import { RoleItem } from './RoleItem';
import { SelectedRole } from './SeletedRole';

export const RoleList: React.FC<{
    onChange: (itemIds: string[]) => void;
    loading?: boolean;
    active: string[];
}> = ({ active, onChange, loading=false }) => {
    const guildId = useGuildId();
    const roleIds = useAppSelector(state => selectGuildRoleIds(state, guildId));
    const { ref: section } = useModuleSection();

    const [open, setOpen] = useState(false);
    const [direction, setDirection] = useState<'top' | 'bottom'>('top');
    const container = useRef<HTMLDivElement>(null)
    const ref = useRef<HTMLButtonElement>(null);
    const items = useRef<HTMLUListElement>(null);

    // If dropdown exceeds parent, change direction of popup items
    useLayoutEffect(() => {
        if(!items.current || !section.current) return;

        const { top: itemTop, height: itemHeight } = items.current.getBoundingClientRect();
        const { top: sectionTop, height: sectionHeight } = section.current.getBoundingClientRect();

        const sectionTotal = sectionTop + sectionHeight;
        const itemTotal = itemTop + itemHeight;

        setDirection(itemTotal > sectionTotal ? 'top' : 'bottom');
    }, [open, section.current]);

    // Closing on click outside component
    useEffect(() => {
        const checkForClickOutside = (e: MouseEvent) => {
            // @ts-ignore: this works
            if(container.current && !container.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', checkForClickOutside);
        return () => document.removeEventListener('mousedown', checkForClickOutside);
    }, []);

    const handleChange = (itemId: string, e: React.MouseEvent) => {
        setOpen(false);
    
        if(active.find(id => id === itemId)) {
            active = active.filter(id => id !== itemId);
        } else {
            active = active.concat(itemId);
        }  
        onChange(active);
    }
    const handleClick = (e: React.MouseEvent) => {
        // Checks if click is on selected item item, if so return
        if(e.currentTarget.contains(ref.current)) return;

        setOpen(prev => !prev);
    }

    const className = [
        styles['container'],
        open ? styles['expanded'] : '',
        styles[direction]
    ].join(' ');
    return(
        <div className={className} ref={container}>
            <div className={styles['selected']}>
                <button 
                    className={styles['selected-button']}
                    onClick={handleClick}
                    disabled={loading}
                    aria-label="Select roles"
                />
                <div className={styles['selected-main']}>
                    {loading ? (
                        <div className={styles['loading']} />
                    ) : (
                        active.length !== 0 ? (
                            <div className={styles['selected-list']}>
                                {active.map(id => (
                                    <SelectedRole 
                                        id={id}
                                        guildId={guildId}
                                        onClick={e => handleChange(id, e)}
                                        key={id}
                                        ref={ref}
                                    />
                                ))}
                            </div>
                        ) : (
                            <span>
                                No roles selected.
                            </span>
                        )
                    )}
                </div>
                <ArrowIcon />
            </div>
            <ul className={styles['items']} ref={items}>
                {roleIds?.map(roleId => (
                    <RoleItem 
                        id={roleId}
                        guildId={guildId}
                        onClick={handleChange}
                        key={roleId}
                    />
                ))}
                {roleIds?.length === 0 && (
                    <span className={styles['empty']}>
                        This server does not seem to have any roles. Note that only roles below Onixo's highest role are displayed.
                    </span>
                )}
            </ul>
        </div>
    )
}