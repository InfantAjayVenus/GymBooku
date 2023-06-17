import { summary, trackRecord } from "date-streaks";
import { useEffect, useState } from "react";
import { streakMileStones } from "src/constants/streakMileStones";
import { StreakData } from "src/models/StreakData";
import { WorkoutTrackCollection } from "src/models/WorkoutRecord";

export default function useStreakData(trackedData: WorkoutTrackCollection[]): StreakData {
    const [trackedDatesList, setTrackedDatesList] = useState<Date[]>([]);
    const [streakData, setStreakData] = useState<StreakData>({} as StreakData);

    useEffect(() => {
        setTrackedDatesList(trackedData.map(item => item.timestamp).filter(dateItem => !!dateItem));
    }, [trackedData])

    useEffect(() => {
        const {currentStreak, longestStreak} = summary({dates: trackedDatesList});
        const lastWeekTrack = trackRecord({dates: trackedDatesList, length: new Date().getDay() + 1});
        const weeklyStreak = Object.entries(lastWeekTrack).map(([date, value]) => ({day: date.split(' ').at(0), isInStreak: value})).reverse();

        setStreakData({
            currentStreak,
            longestStreak,
            weeklyStreak,
            nextMileStone: streakMileStones.find(({streakCount}) => streakCount > currentStreak)
        } as StreakData);
    }, [trackedDatesList]);

    return streakData;
}