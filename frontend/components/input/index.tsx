import React, { HTMLInputTypeAttribute, ReactElement, useEffect, useImperativeHandle, useRef } from "react";
import styles from './Input.module.scss';

type InputProps = {
    focusOnMount?: boolean;
    containerClassName?: string;
    inputClassName?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    name?: string;
    type?: HTMLInputTypeAttribute;
    textArea?: boolean;
    placeholder?: string;
    icon?: ReactElement;
    defaultValue?: string;
    loading?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ focusOnMount, containerClassName, inputClassName, onChange, onSubmit, onFocus, onBlur, name, placeholder, icon, textArea=false, type='text', defaultValue='', loading=false }, ref) => {
    const inputRef = useRef<any>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Handling change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange && onChange(e.currentTarget.value);
    }
    // Handling keypress
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && e.currentTarget.value) {
            onSubmit && onSubmit(e.currentTarget.value);
        }
    }

    useEffect(() => {
        // Setting default value
        inputRef.current.value = defaultValue;

        // Focusing on mount
        if(focusOnMount) {
            inputRef.current?.focus();
        }
    }, [focusOnMount, defaultValue]);

    // Creating general properties
    const props = {
        type,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        className: inputClassName,
        onFocus: onFocus,
        onBlur: onBlur,
        name,
        id: name,
        required: true,
        ref: inputRef,
        placeholder: loading ? 'Loading...' : placeholder,
        disabled: loading
    }

    containerClassName = [
        styles['container'],
        containerClassName
    ].join(' ');
    inputClassName = [
        styles['input'],
        inputClassName
    ].join(' ');
    return(
        <div className={containerClassName}>
            {icon && (
                <label htmlFor={name} aria-label={placeholder} data-testid="input-icon">
                    {icon}
                </label>
            )}
            {textArea ? (
                <textarea 
                    {...props}
                />
            ) : (
                <input 
                    {...props}
                />
            )}
        </div>
    )
});
Input.displayName = 'Input';