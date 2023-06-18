import { CloseIcon } from "@/assets/icons/CloseIcon";
import { selectChannelById } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { forwardRef } from "react";

type Props = {
    id: string;
    guildId: string;
    onClick?: (e: React.MouseEvent) => void;
}
export const SelectedItem = forwardRef<HTMLButtonElement, Props>(({ id, guildId, onClick }, ref) => {
    const channel = useAppSelector(state => selectChannelById(state, guildId, id));

    return(
        <button
            onClick={onClick} 
            ref={ref}
        >
            #{' '}
            {channel?.name}
            <CloseIcon />
        </button>
    )
})
SelectedItem.displayName = 'SelectedItem';