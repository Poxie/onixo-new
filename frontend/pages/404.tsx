import Button from "@/components/button";
import { useRouter } from "next/router";

export default function _404() {
    const router = useRouter();
    return(
        <div style={{
            maxWidth: '90%',
            margin: '0 auto',
            height: `calc(100dvh - var(--navbar-height) - var(--footer-height))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
        }}>
            <h1 style={{
                fontSize: 40,
                margin: 0,
                marginBottom: 'var(--spacing-quaternary)'
            }}>
                404: OOPS, WHAT'S THIS?
            </h1>
            <p style={{
                fontSize: 20,
                color: 'var(--text-secondary)',
                margin: 0,
                marginBottom: 'var(--spacing-primary)',
            }}>
                What you're looking for does not exist. Please recheck the adress you have inputted or go back home.
            </p>
            <div style={{ 
                width: 400, 
                maxWidth: '100%',
                display: 'flex',
                gap: 'var(--spacing-quinary)',
            }}>
                <Button 
                    style={{ flex: 1 }}
                    type={'tertiary'}
                    onClick={router.back}
                >
                    Go back
                </Button>
                <Button 
                    style={{ flex: 1 }}
                    type={'primary'}
                    href={'/'}
                >
                    Go home
                </Button>
            </div>
        </div>
    )
}