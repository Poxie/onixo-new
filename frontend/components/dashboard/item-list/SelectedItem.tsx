import { CloseIcon } from "@/assets/icons/CloseIcon";
import { selectChannelById } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";

export const SelectedItem: React.FC<{
    id: string;
    guildId: string;
    onClick?: () => void;
}> = ({ id, guildId, onClick }) => {
    const channel = useAppSelector(state => selectChannelById(state, guildId, id));

    return(
        <button onClick={onClick}>
            #{' '}
            {channel?.name}
            <CloseIcon />
        </button>
    )
}