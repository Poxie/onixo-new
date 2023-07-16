import { selectChannelById } from "@/redux/slices/dashboard";
import { useAppSelector } from "@/redux/store";
import { Channel } from "@/types";

export const ListItem: React.FC<Channel & {
    guildId: string;
    onClick: (itemId: string, e: React.MouseEvent) => void;
}> = ({ id, guildId, onClick }) => {
    const channel = useAppSelector(state => selectChannelById(state, guildId, id))
    return(
        <li>
            <button onClick={e => onClick(id, e)}>
                #{' '}
                {channel?.name}
            </button>
        </li>
    )
}