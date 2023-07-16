import styles from './SubscriptionModal.module.scss';
import { ModalHeader } from "../ModalHeader"
import { useWebsocket } from '@/contexts/websocket';
import { useEffect, useRef, useState } from 'react';
import { CheckmarkSpinner } from '@/components/checkmark-spinner';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/router';
import Button from '@/components/button';
import { useModal } from '@/contexts/modal';
import { selectGuildById } from '@/redux/slices/dashboard';

const TEXT_ANIMATION_DURATION = 3;
export const SubscriptionModal: React.FC<{
    guildId: string;
    hostedPageId: string;
    onSubscriptionConfimed: () => void;
}> = ({ guildId, hostedPageId, onSubscriptionConfimed }) => {
    const router = useRouter();
    const { close } = useModal();
    const { socket } = useWebsocket();

    const guild = useAppSelector(state => selectGuildById(state, guildId));
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const initial = useRef(true);

    useEffect(() => {
        // Preventing react strict mode from running this twice during development
        if(process.env.NODE_ENV === 'development' && initial.current) {
            initial.current = false;
            return;
        }

        if(!socket || !guildId || !hostedPageId) return;

        // Removing subscription from URL
        router.replace(`/dashboard/${guildId}/premium`, undefined, { shallow: true })

        // Sending payment confirmation request
        socket.emit('CONFIRM_PAYMENT', {
            hosted_page_id: hostedPageId,
            guild_id: guildId
        });

        // Listening to subscription events
        socket.on('SUBSCRIPTION_ACCEPTED', () => {
            setLoading(false);
            onSubscriptionConfimed();
        });
        socket.on('SUBSCRIPTION_DENIED', error => {
            setError(error);
            setLoading(false);
        })

        return () => {
            socket.off('SUBSCRIPTION_ACCEPTED');
            socket.off('SUBSCRIPTION_DENIED');
        }
    }, [socket, guildId, hostedPageId]);

    // Using variants to wait for this animation to finish before showing other text
    const item1: Variants = {
        exit: {
            opacity: 0,
            translateY: 20,
            transition: {
                duration: TEXT_ANIMATION_DURATION
            }
        },
    }

    return(
        <>
        <ModalHeader subHeader={'Please hold on while we activate your premium plan.'}>
            Activating premium
        </ModalHeader>
        <motion.div 
            className={styles['content']}
            transition={{ staggerChildren: TEXT_ANIMATION_DURATION }}
        >
            <CheckmarkSpinner 
                completed={!loading && !error} 
                errored={error !== ''}
            />
            <AnimatePresence>
                {loading && (
                    <motion.span 
                        variants={item1}
                        key={'waiting'}
                    >
                        Waiting for response from server.
                    </motion.span>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {!loading && !error && (
                    <motion.span
                        initial={{ translateY: -20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        key={'success'}
                    >
                        Premium has successfully been activated for <strong>{guild?.name}</strong>.
                    </motion.span>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {error && (
                    <motion.span
                        initial={{ translateY: -20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        key={'error'}
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
        <span className={styles['info']}>
            If your premium for some reason is not activated, please reach out through our
            {' '}
            <a 
                href={process.env.NEXT_PUBLIC_SUPPORT_SERVER}
                referrerPolicy={'no-referrer'}
            >
                support server
            </a>
            .
        </span>
        {!loading && (
            <Button 
                type={'tertiary'}
                className={styles['close-button']}
                onClick={close}
            >
                Close
            </Button>
        )}
        </>
    )
}