import { useRef, useState } from 'react';
import styles from './Features.module.scss';
import { QuickActions } from '../quick-actions';
import { SideActions } from './SideActions';
import { Moderation } from './moderation';
import { Greeting } from './greeting';

export const Features = () => {
    const [active, setActive] = useState<null | string>(null);
    const ref = useRef<HTMLElement>(null);

    const toggleItem = (item: string) => {
        if(active === item) return setActive(null);
        setActive(item);

        // If no previously selected feature, scroll down
        setTimeout(() => {
            if(!active && ref.current) {
                const { top, height } = ref.current?.getBoundingClientRect();
                window.scrollTo({ top: top + height / 1.5 });
            }
        }, 20);
    }

    let component = null;
    switch(active) {
        case 'Moderation':
            component = <Moderation />;
            break;
        case 'Welcomes & Goodbyes':
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