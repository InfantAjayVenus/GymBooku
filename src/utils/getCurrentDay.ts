import { DAYS_OF_WEEK } from "src/models/Plan";

export default function getCurrentDay(): DAYS_OF_WEEK {
    const daysList = [
        DAYS_OF_WEEK.SUNDAY,
        DAYS_OF_WEEK.MONDAY,
        DAYS_OF_WEEK.TUESDAY,
        DAYS_OF_WEEK.WEDNESDAY,
        DAYS_OF_WEEK.THURSDAY,
        DAYS_OF_WEEK.FRIDAY,
        DAYS_OF_WEEK.SATURDAY
    ]
    return daysList[new Date().getDay()];
}