export default (timeStamp: Date): boolean => {
    const date = new Date();
    const today = new Date(date.valueOf() - (date.getTimezoneOffset() * 60 * 1000));
    
    return today.toDateString() === timeStamp.toDateString();
}