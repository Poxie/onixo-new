import styles from './Home.module.scss';
import { QuickActions as QuickActionsList } from '../quick-actions';
import { useMemo, useRef, useState } from 'react';
import actions from '@/assets/json/QuickActions.json';
import { QuickActionsExtension } from './QuickActionExtension';

export type QuickActionJson = typeof actions[0];

const ANIMATE_OUT_DURATION = 700;
export const QuickActions = () => {
    const [active, setActive] = useState<null | string>(null);
    const [animateOut, setAnimateOut] = useState(false);
    const [expired, setExpired] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const onClick = (id: string) => {
        const updateActive = () => setActive(id === active ? null : id);

        if(active) {
            if(active === id) {
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

    const activeAction = useMemo(() => actions.find(action => action.id === active), [active]);
    return(
        <section className={styles['quick-actions']}>
            <span className={styles['back-text']}>
                Quick Actions
            </span>
            
            <QuickActionsList 
                onClick={onClick}
                active={active}
                className={styles['qa-actions']}
            />

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