import TILES from '@/assets/json/FeatureTiles.json';
import { useEffect, useRef, useState } from 'react';
import styles from './Features.module.scss';
import { QuickActions } from '../quick-actions';
import { SideActions } from './SideActions';
import { useRouter } from 'next/router';
import { FeatureTiles } from './FeatureTiles';

export const Features = () => {
    const router = useRouter();
    const { f: defaultActive } = router.query as { f?: string };

    const [active, setActive] = useState<null | string>(defaultActive || null);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if(!defaultActive) return;
        setActive(defaultActive);
        setTimeout(scrollDown, 50);
    }, [defaultActive]);

    const scrollDown = () => {
        if(!ref.current) return;
        const { top, height } = ref.current?.getBoundingClientRect();

        if(!active || window.scrollY < top + height) {
            window.scrollTo({ top: top + height + window.scrollY });
        }
    }
    const toggleItem = (item: string) => {
        if(defaultActive) router.replace(`/features`, undefined, { shallow: true });

        if(active === item) return setActive(null);
        setActive(item);

        // If no previously selected feature, or if user has not scrolled at all, scroll down
        setTimeout(scrollDown, 50);
    }

    let tiles = active ? (
        TILES.find(tile => tile.id === active)?.tiles
    ) : [];
    return(
        <>
        <SideActions 
            active={active}
            onClick={toggleItem}
        />

        <div className={styles['main']}>
            <section 
                className={styles['header']}
                data-feature-header
                ref={ref}
            >
                <h1>
                    What are <span className="highlight">our features?</span>
                </h1>
                <p>
                    You are certain to be pleased by our large variety of commands and modules. Everything from moderation to fun utility commands; from todo lists to auto-welcoming, and much more. Select a module below to view more.
                </p>
                <QuickActions 
                    active={active}
                    onClick={toggleItem}
                    className={styles['qa-actions']}
                    textDefaultVisible
                />
            </section>

            {active && tiles && (
                <section className={styles['feature-content']}>
                    <FeatureTiles 
                        id={active}
                        tiles={tiles}
                    />
                </section>
            )}
        </div>
        </>
    )
}