export const getCurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    
    const suffix = hours > 12 ? 'PM' : 'AM';

    if(hours > 12) hours -= 12;

    return `${hours}:${minutes} ${suffix}`
}