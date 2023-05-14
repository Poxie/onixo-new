import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"

export const Moderation: NextPageWithLayout = () => {
    return(
        <div>
            mod
        </div>
    )
}

Moderation.getLayout = page => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
)