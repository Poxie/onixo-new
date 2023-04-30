import Button from '../button';
import styles from './Home.module.scss';

export const Header = () => {
    return(
        <section className={styles['header-container']}>
            <h1 className={styles['header']}>
                Make your server <span className={`${styles['header-highlight']} highlight`}>YOUR</span> way
            </h1>
            <p className={styles['sub-header']}>
                Onixo provides many different customizable options, as well as fun utilities, moderation, logging, welcoming, and much more.
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
                >
                    See features
                </Button>
            </div>
        </section>
    )
}