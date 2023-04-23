import { HammerIcon } from '@/assets/icons/HammerIcon';
import styles from './Home.module.scss';
import { QuickAction } from './QuickAction';
import { HandIcon } from '@/assets/icons/HandIcon';
import { FeatherIcon } from '@/assets/icons/FeatherIcon';
import { CheckListIcon } from '@/assets/icons/CheckListIcon';
import { ToolsIcon } from '@/assets/icons/ToolsIcon';

export const QuickActions = () => {
    return(
        <section className={styles['quick-actions']}>
            <span className={styles['back-text']}>
                Quick Actions
            </span>
            <ul className={styles['action-list']}>
                <QuickAction 
                    icon={<HammerIcon />}
                    text={'Moderation'}
                />
                <QuickAction 
                    icon={<HandIcon />}
                    text={'Welcomes & Goodbyes'}
                />
                <QuickAction 
                    icon={<FeatherIcon />}
                    text={'Logging'}
                />
                <QuickAction 
                    icon={<CheckListIcon />}
                    text={'Todo lists'}
                />
                <QuickAction 
                    icon={<ToolsIcon />}
                    text={'Settings'}
                />
            </ul>
        </section>
    )
}