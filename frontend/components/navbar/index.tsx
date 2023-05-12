import Link from "next/link"
import styles from './Navbar.module.scss';
import Button from "../button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HamIcon } from "@/assets/icons/HamIcon";
import { NavbarUser } from "./NavbarUser";

const TABS = ['Features', 'Premium', 'Invite'];

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
                    {TABS.map(tab => (
                        <li 
                            onClick={() => setOpen(false)}
                            key={tab}
                        >
                            <Link className={styles['tab']} href={`/${tab.toLowerCase()}`}>
                                {tab}
                            </Link>
                        </li>
                    ))}
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