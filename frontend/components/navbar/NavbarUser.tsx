import styles from './Navbar.module.scss';
import { useAuth } from "@/contexts/auth";
import Button from "../button"
import Image from "next/image";
import { getUserAvatar } from "@/utils/getImages";
import { useRef } from 'react';
import { useMenu } from '@/contexts/menu';
import { useNavbarMenu } from '@/hooks/useNavbarMenu';
import { getLoginLink } from '@/utils/getLinks';

export const NavbarUser = () => {
    const { loading, user } = useAuth();
    const { setMenu } = useMenu();

    const ref = useRef<HTMLButtonElement>(null);
    const { show: showMenu } = useNavbarMenu(ref);

    if(loading) return null;

    return(
        !user ? (
            <Button href={getLoginLink()}>
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
                    {user.global_name}
                </span>
            </button>
        )
    )
}