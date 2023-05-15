import { selectChannelById } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";

export const SelectedItem: React.FC<{
    id: string;
    guildId: string;
    onClick?: () => void;
}> = ({ id, guildId }) => {
    const channel = useAppSelector(state => selectChannelById(state, guildId, id));

    return(
        <span>
            #{' '}
            {channel?.name}
        </span>
    )
}