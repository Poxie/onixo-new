import { DashAuthLayout } from "@/layouts/dash-auth"
import { ActionLogs } from "./ActionLogs"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { EventLogs } from "./EventLogs"

export const Logging: NextPageWithLayout = () => {
    return(
        <>
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