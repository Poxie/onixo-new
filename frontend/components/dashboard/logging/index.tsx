import { DashAuthLayout } from "@/layouts/dash-auth"
import { ActionLogs } from "./ActionLogs"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { EventLogs } from "./EventLogs"
import { ModuleHeader } from "../module-header"

export const Logging: NextPageWithLayout = () => {
    return(
        <>
        <ModuleHeader 
            header={'Logging'}
            subHeader={'Decide where the logs for your moderators\' actions and the events in your server appear.'}
        />
        <ActionLogs />
        <EventLogs />
        </>
    )
}

Logging.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)