import { LoggingImg } from '@/assets/icons/LoggingImg';
import Button from '../button';
import styles from './Home.module.scss';
import { QuickActionJson } from "./QuickActions"
import { TodosImg } from '@/assets/icons/TodosImg';
import { SettingsImg } from '@/assets/icons/SettingsImg';
import { ModerationImg } from '@/assets/icons/ModerationImg';
import { GreetImg } from '@/assets/icons/GreetImg';

export const QuickActionsExtension: React.FC<QuickActionJson & {
    animateOut: boolean;
    expired: boolean;
}> = ({ id, title, content, animateOut, expired }) => {
    let icon = null;
    switch(id) {
        case 'greetings':
            icon = <GreetImg />;
            break;
        case 'moderation':
            icon = <ModerationImg />;
            break;
        case 'logging':
            icon = <LoggingImg />;
            break;
        case 'todos':
            icon = <TodosImg />;
            break;
        case 'settings':
            icon = <SettingsImg />;
            break;
    }
    
    const className = [
        styles['qa-container'],
        animateOut ? styles['animate-out'] : '',
        expired ? styles['expired'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <div className={styles['qa-text']}>
                <h2>
                    {title}
                </h2>
                <p>
                    {content}
                </p>
                <div className={styles['qa-buttons']}>
                    <div className={styles['qa-button']}>
                        <Button href={'/invite'}>
                            Invite to Server
                        </Button>
                    </div>
                    <div className={styles['qa-button']}>
                        <Button 
                            type={'tertiary'}
                            href={`/features?f=${id}`}
                        >
                            Go to {title}
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles['qa-img']}>
                {icon}
            </div>
        </div>
    )
}