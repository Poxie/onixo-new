import { useEffect, useRef, useState } from 'react';
import styles from './Features.module.scss';
import { QuickActions } from '../quick-actions';
import { SideActions } from './SideActions';
import { Moderation } from './moderation';
import { Greeting } from './greeting';
import { useRouter } from 'next/router';

const HEIGHT_PROPORTION = 1.4;

export const Features = () => {
    const router = useRouter();
    const { f: defaultActive } = router.query as { f?: string };

    const [active, setActive] = useState<null | string>(defaultActive || null);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if(!defaultActive) return;
        scrollDown();
    }, [defaultActive]);

    const scrollDown = () => {
        if(!ref.current) return;
        const { top, height } = ref.current?.getBoundingClientRect();

        if(!active || window.scrollY < top + height / HEIGHT_PROPORTION) {
            window.scrollTo({ top: top + height / HEIGHT_PROPORTION + window.scrollY });
        }
    }
    const toggleItem = (item: string) => {
        if(defaultActive) router.replace(`/features`);

        if(active === item) return setActive(null);
        setActive(item);

        // If no previously selected feature, or if user has not scrolled at all, scroll down
        setTimeout(scrollDown, 50);
    }

    let component = null;
    switch(active) {
        case 'moderation':
            component = <Moderation />;
            break;
        case 'greetings':
            component = <Greeting />;
            break;
    }
    
    return(
        <>
        <SideActions 
            active={active}
            onClick={toggleItem}
        />
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

        {component}
        </>
    )
}