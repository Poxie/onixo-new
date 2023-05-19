import { ModuleSection } from "../../module-section"
import { ModuleSubsection } from "../../module-subsection"
import { CustomLinks } from "./CustomLinks"
import { LinkPresets } from "./LinkPresets"
import { NextPageWithLayout } from '@/pages/_app';
import { DashAuthLayout } from '@/layouts/dash-auth';
import { DashboardLayout } from '@/layouts/dashboard';
import { ModerationLayout } from '@/layouts/moderation';

export const Automod: NextPageWithLayout = () => {
    return(
        <ModuleSection
            header={'Anti-link'}
            description={'Prevent unwanted links from appearing in your server.'}
        >
            <ModuleSubsection
                header={'Preset links'}
            >
                <LinkPresets />
            </ModuleSubsection>
            {/* <ModuleSubsection
                header={'Custom links'}
                subHeader='Add your own custom links to scan for. We will automatically scan for all possible link combinations.'
            >
                <CustomLinks />
            </ModuleSubsection> */}
        </ModuleSection>
    )
}

Automod.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            <ModerationLayout>
                {page}
            </ModerationLayout>
        </DashboardLayout>
    </DashAuthLayout>
)