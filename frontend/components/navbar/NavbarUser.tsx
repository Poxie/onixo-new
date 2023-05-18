import styles from './Navbar.module.scss';
import { useAuth } from "@/contexts/auth";
import Button from "../button"
import Image from "next/image";
import { getUserAvatar } from "@/utils/getImages";
import { useCallback, useRef } from 'react';
import { useMenu } from '@/contexts/menu';
import { MenuGroup } from '@/contexts/menu/types';
import { useRouter } from 'next/router';

const oauthUrl = `
https://discord.com/oauth2/authorize
?response_type=code
&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}
&scope=identify%20guilds
&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI as string)}
`.trim();
export const NavbarUser = () => {
    const router = useRouter();
    const { loading, user } = useAuth();
    const { setMenu } = useMenu();

    const ref = useRef<HTMLButtonElement>(null);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/';
    }, []);
    const showMenu = useCallback(() => {
        const groups: MenuGroup[] = [
            [
                { text: 'Dashboard', onClick: () => router.push('/dashboard') },
            ],
            [
                { text: 'Log out', onClick: logout, type: 'danger' }
            ]
        ]
        setMenu(groups, ref);
    }, []);

    if(loading) return null;

    return(
        !user ? (
            <Button href={oauthUrl}>
                Login with Discord
            </Button>
        ) : (
            <button 
                className={styles['user']}
                onClick={showMenu}
                ref={ref}
            >
                <Image 
                    src={getUserAvatar(user.id, user.avatar)}
                    width={24}
                    height={24}
                    alt=""
                />
                <span>
                    {user.username}
                </span>
            </button>
        )
    )
}