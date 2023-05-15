import Image from "next/image";
import styles from './GuildIcon.module.scss';
import { getGuildIcon } from "@/utils/getImages";

export const GuildIcon: React.FC<{
    guildId: string;
    name: string;
    icon: string | null;
    className?: string;
}> = ({ guildId, name, icon, className }) => {
    className = [
        styles['container'],
        className
    ].join(' ');
    return(
        <div className={className}>
            {icon ? (
                <Image 
                    src={getGuildIcon(guildId, icon)}
                    fill
                    alt=""
                />
            ) : (
                <span>
                    {name.slice(0,1).toUpperCase()}
                </span>
            )}
        </div>
    )
}