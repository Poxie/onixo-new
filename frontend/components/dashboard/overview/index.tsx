import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"

export const Overview: NextPageWithLayout = () => {
    return(
        <div>
            test
        </div>
    )
}

Overview.getLayout = page => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
)