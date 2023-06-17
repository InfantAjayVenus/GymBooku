export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    weeklyStreak: [{day: string, isInStreak: boolean}];
    nextMileStone: {level: number, streakCount: number};
}