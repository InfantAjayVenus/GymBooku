export default (timeStamp: Date): boolean => {
    const date = new Date();
    const today = new Date(date.valueOf());
    
    return today.toDateString() === timeStamp.toDateString();
}