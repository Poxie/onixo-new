export type User = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    banner: string;
}
export type Guild = {
    id: string;
    name: string;
    icon: string;
    owner_id: string;
    splash?: string;
}