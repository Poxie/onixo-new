import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"

export const Moderation: NextPageWithLayout = () => {
    return(
        <>
            <ModuleHeader 
                header="Moderation"
                subHeader="Keep your server clean with our large range of moderation tools."
            />
        </>
    )
}

Moderation.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)