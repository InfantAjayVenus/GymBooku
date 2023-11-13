import { DAYS_OF_WEEK } from "src/models/Plan";

export default (today=new Date()): DAYS_OF_WEEK => {
    const localeToday = new Date(today.valueOf() - (today.getTimezoneOffset() * 60 * 1000));
    const localeDay = localeToday.toDateString().split(' ')[0].toLowerCase();
    
    return Object.keys(DAYS_OF_WEEK).filter(day => day.toLowerCase().includes(localeDay)).shift() as DAYS_OF_WEEK
}