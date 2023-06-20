import styles from './ModuleSubheader.module.scss';

export const ModuleSubheader: React.FC<{
    children: any;
    extraHeader?: string;
    className?: string;
}> = ({ children, className, extraHeader }) => {
    className = [
        styles['text'],
        className
    ].join(' ');
    return(
        <>
        <p className={className}>
            {children}
        </p>
        {extraHeader && (
            <span>
                {extraHeader}
            </span>
        )}
        </>
    )
}