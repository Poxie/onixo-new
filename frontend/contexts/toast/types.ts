export type Toast = {
    id: string;
    text: string;
    duration: number;
    type: 'info' | 'success' | 'danger';
}
export type ToastArgs = { text: Toast['text'] } & Partial<Toast>;