import styles from './QuickActions.module.scss';
import { HammerIcon } from '@/assets/icons/HammerIcon';
import { QuickAction } from './QuickAction';
import { HandIcon } from '@/assets/icons/HandIcon';
import { FeatherIcon } from '@/assets/icons/FeatherIcon';
import { CheckListIcon } from '@/assets/icons/CheckListIcon';
import { ToolsIcon } from '@/assets/icons/ToolsIcon';

const items = [
    { id: 'moderation', text: 'Moderation', icon: <HammerIcon /> },
    { id: 'greetings', text: 'Welcomes & Goodbyes', icon: <HandIcon /> },
    { id: 'logging', text: 'Logging', icon: <FeatherIcon /> },
    { id: 'todos', text: 'Todo lists', icon: <CheckListIcon /> },
    { id: 'settings', text: 'Settings', icon: <ToolsIcon /> }
]

export const QuickActions: React.FC<{
    onClick: (text: string) => void;
    active: string | null;
    textDefaultVisible?: boolean;
    className?: string;
}> = ({ onClick, active, className, textDefaultVisible }) => {
    className = [
        styles['action-list'],
        textDefaultVisible ? styles['text-visible'] : '',
        className
    ].join(' ');
    return(
        <ul className={className}>
            {items.map(item => (
                <QuickAction 
                    {...item}
                    onClick={() => onClick(item.id)}
                    active={active === item.id}
                    key={item.id}
                />
            ))}
        </ul>
    )
}