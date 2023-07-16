import { useModal } from "@/contexts/modal"
import { ModalFooter } from "../ModalFooter"
import { ModalHeader } from "../ModalHeader"
import { useAuth } from "@/contexts/auth";
import { useGuildId } from "@/hooks/useGuildId";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { updateGuild } from "@/redux/slices/dashboard";

export const CancelSubscriptionModal = () => {
    const guildId = useGuildId();
    const { destroy } = useAuth();
    const { close } = useModal();

    const dispatch = useAppDispatch();
    
    const [loading, setLoading] = useState(false);

    const cancelSubscription = () => {
        setLoading(true);

        destroy<{ premium_ends_at: number }>(`/guilds/${guildId}/subscriptions`)
            .then(({ premium_ends_at }) => {
                dispatch(updateGuild({ guildId, property: 'premium_ends_at', value: premium_ends_at }));
                close();
            })
            .finally(() => {
                setLoading(false);
            })
    }
    
    return(
        <>
        <ModalHeader
            subHeader={'Are you sure you want to cancel your subscription? Your server will have premium until your billing period ends.'}
        >
            Cancel Premium
        </ModalHeader>
        <ModalFooter 
            onCancel={close}
            onConfirm={cancelSubscription}
            cancelLabel={'Close'}
            confirmLabel={'Confirm Cancellation'}
            confirmLoadingLabel={'Canceling...'}
            confirmLoading={loading}
        />
        </>
    )
}