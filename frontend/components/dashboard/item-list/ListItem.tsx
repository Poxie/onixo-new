import { selectChannelById } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";

export const ListItem: React.FC<{
    id: string;
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