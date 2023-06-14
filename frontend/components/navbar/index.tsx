import Link from "next/link"
import styles from './Navbar.module.scss';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HamIcon } from "@/assets/icons/HamIcon";
import { NavbarUser } from "./NavbarUser";

const TABS = [
    { text: 'Home', path: '/' },
    { text: 'Features', path: '/features' },
    { text: 'Premium', path: '/premium' },
    { text: 'Support', path: '/support' },
    { text: 'Invite', path: '/invite' },
]

export const Navbar = () => {
    const asPath = useRouter().asPath;
    const [open, setOpen] = useState(false);

    // If path change, make sure to close mobile nav
    useEffect(() => setOpen(false), [asPath]);

    const className = [
        styles['container'],
        open ? styles['open'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <div className={styles['left']}>
                <Link className={styles['header']} href="/">
                    {process.env.NEXT_PUBLIC_WEBSITE_NAME}
                </Link>
                <ul className={styles['tabs']}>
                    {TABS.map(({ text, path }) => {
                        const active = path === asPath;

                        return(
                            <li 
                                onClick={() => setOpen(false)}
                                key={path}
                            >
                                <Link 
                                    className={`${styles['tab']} ${active ? styles['active'] : ''}`} 
                                    href={path}
                                >
                                    {text}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className={styles['buttons']}>
                <NavbarUser />
                <div 
                    className={styles['ham']}
                    onClick={() => setOpen(!open)}
                >
                    <HamIcon />
                </div>
            </div>
        </div>
    )
}