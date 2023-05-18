import styles from './Menu.module.scss';
import { MenuItem as MenuItemType } from "../contexts/menu/types"
import { MenuItem } from "./MenuItem";

export const MenuGroup: React.FC<{
    items: MenuItemType[];
}> = ({ items }) => {
    return(
        <div className={styles['group']}>
            {items.map((item, key) => (
                <MenuItem 
                    {...item}
                    key={key}
                />
            ))}
        </div>
    )
}