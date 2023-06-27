import { selectRoleById } from "@/redux/dashboard/selectors";
import { useAppSelector } from "@/redux/store";
import { Role } from "@/types";
import { CSSProperties } from "react";

export const RoleItem: React.FC<Role & {
    guildId: string;
    onClick: (itemId: string, e: React.MouseEvent) => void;
}> = ({ id, guildId, onClick }) => {
    const role = useAppSelector(state => selectRoleById(state, guildId, id))
    return(
        <li>
            <button 
                onClick={e => onClick(id, e)}
                style={{ '--dot-color': role?.color ? `#${role.color.toString(16)}` : 'var(--text-primary)' } as CSSProperties}
            >
                {role?.name}
            </button>
        </li>
    )
}