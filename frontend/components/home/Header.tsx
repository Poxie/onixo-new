import Button from '../button';
import styles from './Home.module.scss';

export const Header = () => {
    return(
        <section className={styles['header-container']}>
            <h1 className={styles['header']}>
                Customize your server <span className={`${styles['header-highlight']} highlight`}>your</span> way.
            </h1>
            <p className={styles['sub-header']}>
                Onixo is a Discord bot based around utility, moderation, fun and most of all: ease of use and customization. Server management just became effortless.
            </p>
            <div className={styles['header-buttons']}>
                <Button 
                    className={styles['header-button']}
                    href={'/invite'}
                >
                    Invite to Server
                </Button>
                <Button 
                    className={styles['header-button']} 
                    type={'secondary'}
                    href={'/features'}
                >
                    See features
                </Button>
            </div>
        </section>
    )
}