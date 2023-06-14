import styles from './Home.module.scss';
import { QuickActions as QuickActionsList } from '../quick-actions';
import { useMemo, useRef, useState } from 'react';
import actions from '@/assets/json/QuickActions.json';
import { QuickActionsExtension } from './QuickActionExtension';

export type QuickActionJson = typeof actions[0];

const ANIMATE_OUT_DURATION = 700;
const SCROLL_THRESHOLD = 150;

export const QuickActions = () => {
    const [active, setActive] = useState<null | string>(null);
    const [animateOut, setAnimateOut] = useState(false);
    const [expired, setExpired] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const onClick = (id: string) => {
        const updateActive = () => setActive(id === active ? null : id);

        // Updating current visible item
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

        // Checking if user needs to be scrolled to see content
        setTimeout(() => {
            if(!ref.current) return;
            const expansionTop = ref.current.getBoundingClientRect().top;
            const diff = window.innerHeight - expansionTop - SCROLL_THRESHOLD;
            
            if(diff < 0) {
                window.scrollTo({
                    top: expansionTop
                })
            }
        }, 10);
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
                    ref={ref}
                />
            )}
        </section>
    )
}