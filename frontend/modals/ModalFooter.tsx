import Button from '../components/button';
import styles from './Modal.module.scss';

export const ModalFooter: React.FC<{
    cancelLabel?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLoading?: boolean;
    confirmLoadingLabel?: string;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
}> = ({ confirmLabel='Confirm', onConfirm, cancelLabel='Cancel', onCancel, confirmLoadingLabel='Loading...', confirmLoading=false, confirmDisabled=false, cancelDisabled=false }) => {
    return(
        <div className={styles['footer']}>
            <Button 
                onClick={onCancel}
                type={'transparent'}
                disabled={cancelDisabled}
            >
                {cancelLabel}
            </Button>
            <Button
                onClick={onConfirm}
                disabled={confirmDisabled || confirmLoading}
            >
                {!confirmLoading ? confirmLabel : confirmLoadingLabel}
            </Button>
        </div>
    )
}