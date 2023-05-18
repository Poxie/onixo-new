import { useMenu } from "@/contexts/menu";
import { MenuGroup } from "@/contexts/menu/types";
import { useRouter } from "next/router";
import { RefObject, useCallback } from "react";

export const useNavbarMenu = (ref: RefObject<HTMLButtonElement>) => {
    const router = useRouter();
    const { setMenu, close } = useMenu();

    const logout = useCallback(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/';
    }, []);
    const show = useCallback(() => {
        const groups: MenuGroup[] = [
            [
                { text: 'Dashboard', onClick: () => router.push('/dashboard') },
            ],
            [
                { text: 'Log out', onClick: logout, type: 'danger' }
            ]
        ]
        setMenu(groups, ref);
    }, [setMenu, ref]);

    return { show, hide: close };
}