import { DAYS_OF_WEEK } from "src/models/Plan";

export default (): DAYS_OF_WEEK => {
    const today = new Date();
    const localeToday = new Date(today.valueOf());
    const localeDay = localeToday.toDateString().split(' ')[0].toLowerCase();
    
    return Object.keys(DAYS_OF_WEEK).filter(day => day.toLowerCase().includes(localeDay)).shift() as DAYS_OF_WEEK
}
