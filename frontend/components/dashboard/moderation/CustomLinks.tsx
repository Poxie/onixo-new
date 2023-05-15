import styles from './Moderation.module.scss';
import { Input } from "@/components/input"

export const CustomLinks = () => {
    return(
        <>
        <Input 
            placeholder={'Ex: poxen.dev'}
        />
        <div className={styles['link-container']}>
            <span>
                No custom links have been added.
            </span>
        </div>
        </>
    )
}