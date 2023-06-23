export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    weeklyStreak: [{day: string, isInStreak: boolean, isToday?: boolean}];
    nextMileStone: {level: number, streakCount: number};
}