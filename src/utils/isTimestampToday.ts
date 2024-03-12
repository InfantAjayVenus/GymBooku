import dayjs from "dayjs";

export default (timeStamp: Date): boolean => {
    const today = dayjs();
    return today.isSame(timeStamp, 'date') && today.isSame(timeStamp, 'month') && today.isSame(timeStamp, 'year');
}