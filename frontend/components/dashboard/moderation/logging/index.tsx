import { DashAuthLayout } from "@/layouts/dash-auth"
import { ActionLogs } from "./ActionLogs"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { EventLogs } from "./EventLogs"
import { ModerationLayout } from "@/layouts/moderation"

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
            <ModerationLayout>
                {page}
            </ModerationLayout>
        </DashboardLayout>
    </DashAuthLayout>
)