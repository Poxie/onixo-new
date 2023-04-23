import Link from 'next/link';
import styles from './Footer.module.scss';

export const Footer = () => (
    <footer className={styles['container']}>
        <div>
            <img src="/avatars/onixo.png" alt="" />
            <span>
                Onixo
            </span>
        </div>
        <span>
            designed & created by 
            <span className="bold highlight">
                <Link href={'https://poxen.dev'} target="_blank">
                    Poxen
                </Link>
            </span>
        </span>
    </footer>
)