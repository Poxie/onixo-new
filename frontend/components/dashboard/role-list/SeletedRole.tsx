import { CloseIcon } from "@/assets/icons/CloseIcon";
import { selectRoleById } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { CSSProperties, forwardRef } from "react";

type Props = {
    id: string;
    guildId: string;
    onClick?: (e: React.MouseEvent) => void;
}
export const SelectedRole = forwardRef<HTMLButtonElement, Props>(({ id, guildId, onClick }, ref) => {
    const role = useAppSelector(state => selectRoleById(state, guildId, id));

    return(
        <button
            style={{ '--dot-color': `#${role?.color.toString(16)}` } as CSSProperties}
            onClick={onClick} 
            ref={ref}
        >
            {role?.name}
            <CloseIcon />
        </button>
    )
})
SelectedRole.displayName = 'SelectedRole';