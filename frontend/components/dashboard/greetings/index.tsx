import { DashAuthLayout } from "@/layouts/dash-auth"
import { DashboardLayout } from "@/layouts/dashboard"
import { NextPageWithLayout } from "@/pages/_app"
import { ModuleHeader } from "../module-header"
import { Welcomes } from './Welcomes';
import { Goodbyes } from './Goodbyes';

export const Greetings: NextPageWithLayout = () => {
    return(
        <>
        <ModuleHeader 
            header={'Welcomes & Goodbyes'}
            subHeader={'Greet your new members with a welcoming message, a role or a DM. If they leave, send them a farewell message.'}
        />
        <Welcomes />
        <Goodbyes />
        </>
    )
}

Greetings.getLayout = page => (
    <DashAuthLayout>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </DashAuthLayout>
)