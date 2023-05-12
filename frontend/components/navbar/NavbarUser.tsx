import styles from './Navbar.module.scss';
import { useAuth } from "@/contexts/auth";
import Button from "../button"
import Image from "next/image";
import { getUserAvatar } from "@/utils/getImages";

const oauthUrl = `
https://discord.com/oauth2/authorize
?response_type=code
&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}
&scope=identify%20guilds
&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI as string)}
`.trim();
export const NavbarUser = () => {
    const { loading, user } = useAuth();

    if(loading) return null;

    return(
        !user ? (
            <Button href={oauthUrl}>
                Login with Discord
            </Button>
        ) : (
            <button className={styles['user']}>
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