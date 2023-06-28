export const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    
    const suffix = hours > 12 ? 'PM' : 'AM';

    if(hours > 12) hours -= 12;

    return `${hours}:${minutes} ${suffix}`
}
export const getRelativeTime = (timestamp: number) => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const date = new Date(timestamp * 1000);

    // Determining time of message
    const readableTime = date.toLocaleTimeString('en', { minute: '2-digit', hour: '2-digit' })

    // Determining day of message
    const isToday = now.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();

    // Adding prefix to date
    let prefix;
    if(isToday) {
        prefix = 'Today at ';
    } else if(isYesterday) {
        prefix = 'Yesterday at ';
    } else {
        prefix = date.toLocaleString('en', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('-', '/');
    }

    const readableDate = `${prefix} ${readableTime}`;
    const fullDate = date.toLocaleString('en', { dateStyle: 'full', timeStyle: 'short' });

    return { readableDate, fullDate };
}