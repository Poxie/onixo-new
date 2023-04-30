import Button from '../button';
import styles from './Home.module.scss';
import { QuickActionJson } from "./QuickActions"

export const QuickActionsExtension: React.FC<QuickActionJson & {
    animateOut: boolean;
    expired: boolean;
}> = ({ title, content, img, animateOut, expired }) => {
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
                        <Button type={'tertiary'}>
                            Go to {title}
                        </Button>
                    </div>
                </div>
            </div>
            <img src={`/icons/${img}`} alt="" />
        </div>
    )
}