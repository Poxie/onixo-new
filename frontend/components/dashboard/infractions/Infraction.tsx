import Image from 'next/image';
import styles from './Infractions.module.scss';
import { Embed as EmbedType, Infraction as InfractionType } from "@/types";
import { CSSProperties } from 'react';
import { useModal } from '@/contexts/modal';
import { InfractionModal } from '@/modals/infraction';
import { useGuildId } from '@/hooks/useGuildId';
import { EditIcon } from '@/assets/icons/EditIcon';

const firstLetterUppercase = (text: string) => text.slice(0, 1).toUpperCase() + text.slice(1);
export const Infraction: React.FC<InfractionType & {
    editable?: boolean;
}> = ({
    _id, issuer, target, action, case_id, reason, date, editable
}) => {
    const guildId = useGuildId();
    const { setModal } = useModal();

    const openModal = () => (
        setModal(
            <InfractionModal 
                guildId={guildId}
                infractionId={_id}
            />
        )
    )

    return(
        <div 
            className={styles['item']}
            style={{ '--action-color': `var(--${action}-color)` } as CSSProperties}
        >
            {editable && (
                <button
                    className={styles['edit-button']}
                    onClick={openModal}
                >
                    <EditIcon />
                </button>
            )}
            <span className={styles['header']}>
                {firstLetterUppercase(action)} - Case {case_id}
            </span>
            <div className={styles['field']}>
                <span className={styles['field-name']}>
                    Target
                </span>
                <span className={styles['field-value']}>
                    <div className={styles['avatar']}>
                        <Image 
                            src={target.avatar}
                            width={20}
                            height={20}
                            alt=""
                        />
                    </div>
                    <span>
                        {target.global_name}
                        {' '}
                        <span className={styles['muted']}>
                            ({target.id})
                        </span>
                    </span>
                </span>
            </div>
            <div className={styles['field']}>
                <span className={styles['field-name']}>
                    Issuer
                </span>
                <span className={styles['field-value']}>
                    <div className={styles['avatar']}>
                        <Image 
                            src={issuer.avatar}
                            width={20}
                            height={20}
                            alt=""
                        />
                    </div>
                    <span>
                        {issuer.global_name}
                        {' '}
                        <span className={styles['muted']}>
                            ({issuer.id})
                        </span>
                    </span>
                </span>
            </div>
            <div className={styles['field']}>
                <span className={styles['field-name']}>
                    Reason
                </span>
                <span className={styles['field-value']}>
                    {reason || (
                        <span className={styles['muted']}>
                            Reason was not specified.
                        </span>
                    )}
                </span>
            </div>
        </div>
    )
}