import { useModal } from "@/contexts/modal"
import { ModalFooter } from "../ModalFooter"
import { ModalHeader } from "../ModalHeader"
import { useAuth } from "@/contexts/auth";
import { useGuildId } from "@/hooks/useGuildId";

export const CancelSubscriptionModal = () => {
    const guildId = useGuildId();
    const { destroy } = useAuth();
    const { close } = useModal();

    const cancelSubscription = async () => {
        const res = await destroy(`/guilds/${guildId}/subscriptions`);
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
        />
        </>
    )
}