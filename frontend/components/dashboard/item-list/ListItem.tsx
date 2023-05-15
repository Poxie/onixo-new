import { selectChannelById } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";

export const ListItem: React.FC<{
    id: string;
    guildId: string;
    onClick: (itemId: string) => void;
}> = ({ id, guildId, onClick }) => {
    const channel = useAppSelector(state => selectChannelById(state, guildId, id))
    return(
        <li>
            <button onClick={() => onClick(id)}>
                #{' '}
                {channel?.name}
            </button>
        </li>
    )
}