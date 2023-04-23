import Link from "next/link"

const TABS = ['Features', 'Premium', 'Invite'];

export const Navbar = () => {
    return(
        <>
        <Link href="/">
            {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </Link>
        <ul>
            {TABS.map(tab => (
                <li key={tab}>
                    <Link href={`/${tab.toLowerCase()}`}>
                        {tab}
                    </Link>
                </li>
            ))}
        </ul>
        </>
    )
}