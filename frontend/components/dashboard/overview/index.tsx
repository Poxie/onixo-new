import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { OverviewHeader } from './OverviewHeader';
import { OverviewModules } from "./OverviewModules";
import { OverviewUtilities } from "./OverviewUtilities";

export const Overview: NextPageWithLayout = () => {
    return(
        <>
        <OverviewHeader />
        <OverviewModules />
        <OverviewUtilities />
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