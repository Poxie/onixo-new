import { HammerIcon } from '@/assets/icons/HammerIcon';
import styles from './Home.module.scss';
import { QuickAction } from './QuickAction';
import { HandIcon } from '@/assets/icons/HandIcon';
import { FeatherIcon } from '@/assets/icons/FeatherIcon';
import { CheckListIcon } from '@/assets/icons/CheckListIcon';
import { ToolsIcon } from '@/assets/icons/ToolsIcon';
import { useMemo, useRef, useState } from 'react';
import actions from '@/assets/json/QuickActions.json';
import { QuickActionsExtension } from './QuickActionExtension';

export type QuickActionJson = typeof actions[0];

const items = [
    { text: 'Moderation', icon: <HammerIcon /> },
    { text: 'Welcomes & Goodbyes', icon: <HandIcon /> },
    { text: 'Logging', icon: <FeatherIcon /> },
    { text: 'Todo lists', icon: <CheckListIcon /> },
    { text: 'Settings', icon: <ToolsIcon /> }
]

const ANIMATE_OUT_DURATION = 700;
export const QuickActions = () => {
    const [active, setActive] = useState<null | string>(null);
    const [animateOut, setAnimateOut] = useState(false);
    const [expired, setExpired] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const onClick = (text: string) => {
        const updateActive = () => setActive(text === active ? null : text);

        if(active) {
            if(active === text) {
                setExpired(true);
            }
            setAnimateOut(true);

            if(timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                updateActive();
                setAnimateOut(false);
                setExpired(false);
            }, ANIMATE_OUT_DURATION);
        } else {
            updateActive();
        }
    }

    const activeAction = useMemo(() => actions.find(action => action.title === active), [active]);
    return(
        <section className={styles['quick-actions']}>
            <span className={styles['back-text']}>
                Quick Actions
            </span>
            <ul className={styles['action-list']}>
                {items.map(item => (
                    <QuickAction 
                        {...item}
                        onClick={() => onClick(item.text)}
                        active={active === item.text}
                        key={item.text}
                    />
                ))}
            </ul>

            {activeAction && (
                <QuickActionsExtension 
                    {...activeAction}
                    animateOut={animateOut}
                    expired={expired}
                />
            )}
        </section>
    )
}