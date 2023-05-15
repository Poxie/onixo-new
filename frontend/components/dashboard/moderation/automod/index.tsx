import styles from '../Moderation.module.scss';
import { ModuleSection } from "../../module-section"
import { ModuleSubsection } from "../../module-subsection"
import { CustomLinks } from "./CustomLinks"
import { LinkPresets } from "./LinkPresets"

export const Automod = () => {
    return(
        <ModuleSection
            header={'Anti-link'}
            description={'Prevent unwanted links from appearing in your server.'}
            className={styles['section']}
        >
            <ModuleSubsection
                header={'Preset links'}
            >
                <LinkPresets />
            </ModuleSubsection>
            <ModuleSubsection
                header={'Custom links'}
                subHeader='Add your own custom links to scan for. We will automatically scan for all possible link combinations.'
            >
                <CustomLinks />
            </ModuleSubsection>
        </ModuleSection>
    )
}