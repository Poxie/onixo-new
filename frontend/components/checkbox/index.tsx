import { useEffect, useState } from 'react';
import styles from './Checkbox.module.scss';

export const Checkbox: React.FC<{
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    loading?: boolean;
    id?: string;
}> = ({ onChange, loading=false, defaultChecked=false, id }) => {
    const [checked, setChecked] = useState(defaultChecked);

    // If default value change, update input
    useEffect(() => setChecked(defaultChecked), [defaultChecked]);

    const handleChange = () => {
        setChecked(prev => {
            if(onChange) onChange(!prev);
            return !prev;
        });
    }

    const className = [
        styles['checkbox'],
        checked ? styles['checked'] : styles['unchecked']
    ].join(' ');
    return(
        <button 
            id={id}
            className={className}
            onClick={handleChange}
            disabled={loading}
            aria-label={checked ? 'Disable' : 'Enable'}
            key={`${checked}`}
        >
            {!loading && (
                <div className={styles['knob']}>
                    <div className={styles['line1']}></div>
                    <div className={styles['line2']}></div>
                </div>
            )}
        </button>
    )
}