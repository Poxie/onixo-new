import styles from './InfractionModal.module.scss';
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ModalHeader } from "../ModalHeader"
import { ModuleSubheader } from "@/components/dashboard/module-subheader";
import { Input } from "@/components/input";
import { ModalFooter } from '../ModalFooter';
import { useModal } from '@/contexts/modal';
import { Infraction } from '@/components/dashboard/infractions/Infraction';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/contexts/toast';
import { selectInfractionById, updateInfraction } from '@/redux/slices/dashboard';

export const InfractionModal: React.FC<{
    infractionId: string;
    guildId: string;
}> = ({ guildId, infractionId }) => {
    const { patch } = useAuth();
    const { close } = useModal();
    const { setToast } = useToast();

    const dispatch = useAppDispatch();
    const infraction = useAppSelector(state => selectInfractionById(state, guildId, infractionId));

    const [tempInfraction, setTempInfraction] = useState(infraction);
    const [updating, setUpdating] = useState(false);

    if(!infraction || !tempInfraction) return null;
    
    const sendUpdateRequest = () => {
        // Determining what properties need to update
        const propertiesToUpdate: {[key: string]: any} = {};
        Object.entries(tempInfraction).forEach(([key, value]) => {
            const isSame = JSON.stringify(infraction[key as keyof typeof infraction]) === JSON.stringify(value);
            if(!isSame) {
                propertiesToUpdate[key] = value;
            }
        });

        // Checking if there are any properties to update
        if(!Object.keys(propertiesToUpdate).length) {
            setToast({ text: 'You have no unsaved changes.' });
            return;
        }

        // Updating infraction
        setUpdating(true);
        patch(`/guilds/${guildId}/infractions/${infraction.case_id}`, propertiesToUpdate)
            .then(() => {
                setToast({ text: 'Successfully updated infraction.', type: 'success' });
                dispatch(updateInfraction({ guildId, infraction: tempInfraction }));
            })
            .catch(() => {
                setToast({ text: 'Something went wrong while updating infraction.', type: 'danger' });
                setTempInfraction(infraction);
            })
            .finally(() => {
                setUpdating(false);
            })
    }
    const updateProperty = (property: 'reason', value: any) => {
        setTempInfraction(prev => {
            if(!prev) return prev;
            
            return{
                ...prev,
                [property]: value
            }
        })
    }

    return(
        <>
        <ModalHeader subHeader={'Need to make changes to this infraction?'}>
            Edit infraction
        </ModalHeader>
        <div className={styles['main']}>
            <Infraction
                {...tempInfraction}
            />
            <ModuleSubheader className={styles['header']}>
                Reason
            </ModuleSubheader>
            <Input 
                placeholder={'Reason'}
                defaultValue={infraction?.reason || ''}
                onChange={text => updateProperty('reason', text)}
            />
        </div>
        <ModalFooter
            onCancel={close}
            onConfirm={sendUpdateRequest}
            confirmDisabled={updating}
        />
        </>
    )
}