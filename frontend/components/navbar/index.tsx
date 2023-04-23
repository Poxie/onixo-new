import Link from "next/link"
import styles from './Navbar.module.scss';
import Button from "../button";

const TABS = ['Features', 'Premium', 'Invite'];

export const Navbar = () => {
    return(
        <div className={styles['container']}>
            <div className={styles['left']}>
                <Link className={styles['header']} href="/">
                    {process.env.NEXT_PUBLIC_WEBSITE_NAME}
                </Link>
                <ul className={styles['tabs']}>
                    {TABS.map(tab => (
                        <li key={tab}>
                            <Link className={styles['tab']} href={`/${tab.toLowerCase()}`}>
                                {tab}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles['buttons']}>
                <Button>
                    Login with Discord
                </Button>
            </div>
        </div>
    )
}