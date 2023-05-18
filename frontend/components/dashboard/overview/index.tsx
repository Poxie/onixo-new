import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleSubheader } from '../module-subheader';
import { OverviewHeader } from './OverviewHeader';
import { OverviewModules } from "./OverviewModules";

export const Overview: NextPageWithLayout = () => {
    
    return(
        <>
        <OverviewHeader />
        <OverviewModules />
        </>
    )
}

Overview.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)