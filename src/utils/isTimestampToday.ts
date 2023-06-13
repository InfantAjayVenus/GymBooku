export default (timeStamp: Date): boolean => {
    const today = new Date();

    return today.toDateString() === timeStamp.toDateString();
}