import styles from './Embeds.module.scss';
import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleSubheader } from '../module-subheader';
import { ItemList } from '../item-list';
import { ModuleSection } from '../module-section';

export const Embeds: NextPageWithLayout = () => {
    return(
        <>
        <ModuleSection 
            description={'Send a custom-made embed in any channel you would like.'}
            header={'Embed Messages'}
        >
            <div>
                <ModuleSubheader extraHeader={'Select the channel you want to send the embed in.'}>
                    Embed Channel
                </ModuleSubheader>
                <ItemList />
            </div>
        </ModuleSection>
        </>
    )
}

Embeds.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)