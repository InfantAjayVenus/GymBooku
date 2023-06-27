import { summary, trackRecord } from "date-streaks";
import { useEffect, useState } from "react";
import { streakMileStones } from "src/constants/streakMileStones";
import { DAYS_OF_WEEK } from "src/models/Plan";
import { StreakData } from "src/models/StreakData";
import { WorkoutTrackCollection } from "src/models/WorkoutRecord";
import { toTitleCase } from "src/utils/toTitleCase";

export default function useStreakData(trackedData: WorkoutTrackCollection[]): StreakData {
    const [trackedDatesList, setTrackedDatesList] = useState<Date[]>([]);
    const [streakData, setStreakData] = useState<StreakData>({} as StreakData);

    useEffect(() => {
        setTrackedDatesList(trackedData.map(item => item.timestamp).filter(dateItem => !!dateItem));
    }, [trackedData])

    useEffect(() => {
        const {currentStreak=0, longestStreak=0} = summary({dates: trackedDatesList});
        const lastWeekTrack = trackRecord({dates: trackedDatesList, length: new Date().getDay() + 1});
        
        const weeklyStreakData = Object.entries(lastWeekTrack).map(([date, value]) => ({day: date.split(' ').at(0), isInStreak: value})).reverse();
        const weeklyStreak = Object.keys(DAYS_OF_WEEK).map(day => {
            const formattedDay = toTitleCase(day.slice(0, 3));
            return weeklyStreakData.find(
                ({day: dayItem}) => dayItem?.toLowerCase() === formattedDay.toLowerCase()
            ) || {day: formattedDay, isInStreak: false};
        }).map(item => ({
            ...item,
            isToday: item.day?.toLowerCase() === (new Date()).toString().split(' ')[0].toLowerCase()
        }))

        setStreakData({
            currentStreak,
            longestStreak,
            weeklyStreak,
            nextMileStone: streakMileStones.find(({streakCount}) => streakCount > currentStreak)
        } as StreakData);
    }, [trackedDatesList]);

    return streakData;
}