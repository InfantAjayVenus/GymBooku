export default (timeStamp: number): boolean => {
    const date = new Date(timeStamp);
    const today = new Date();

    return today.toDateString() === date.toDateString();
}