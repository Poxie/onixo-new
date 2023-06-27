import styles from './RoleList.module.scss'
import { useGuildId } from "@/hooks/useGuildId"
import { selectGuildRoles } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { useModuleSection } from '../module-section';
import { RoleItem } from './RoleItem';
import { SelectedRole } from './SeletedRole';
import { Input } from '@/components/input';

export const RoleList: React.FC<{
    onChange: (itemIds: string[]) => void;
    loading?: boolean;
    active: string[];
}> = ({ active, onChange, loading=false }) => {
    const guildId = useGuildId();
    const roles = useAppSelector(state => selectGuildRoles(state, guildId));
    const { ref: section } = useModuleSection();

    const [open, setOpen] = useState(false);
    const [direction, setDirection] = useState<'top' | 'bottom'>('top');
    const [search, setSearch] = useState('');

    const container = useRef<HTMLDivElement>(null)
    const ref = useRef<HTMLButtonElement>(null);
    const items = useRef<HTMLDivElement>(null);

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

    const filteredRoles = useMemo(() => roles?.filter(role => (
        !search ? role : role.name.toLowerCase().includes(search.toLowerCase())
    )), [roles, search]);

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
            <div className={styles['items']} ref={items}>
                <Input 
                    placeholder={'Search'}
                    containerClassName={styles['input']}
                    onChange={setSearch}
                    focusOnMount
                />
                <ul className={styles['item-list']}>
                    {filteredRoles?.map(role => (
                        <RoleItem 
                            {...role}
                            guildId={guildId}
                            onClick={handleChange}
                            key={role.id}
                        />
                    ))}
                </ul>
                {filteredRoles?.length === 0 && (
                    <span className={styles['muted']}>
                        No roles were found.
                    </span>
                )}
            </div>
        </div>
    )
}