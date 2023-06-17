import { Box, Chip, Paper, Skeleton, Typography } from "@mui/material"
import { StreakData } from "src/models/StreakData"


function StreakCard({ currentStreak, longestStreak, nextMileStone, weeklyStreak }: StreakData) {
    return (
        <>
            <Paper sx={{
                padding: '1rem',
                borderRadius: '0.5rem'
            }}>
                <Typography variant="body1" fontWeight={'semi-bold'} component={'p'} color={'GrayText'} align="right">Streak</Typography>
                {
                    currentStreak ?
                        <Typography variant="h3" fontWeight={'bold'} component={'h4'} align="center" marginBottom={'1rem'}>{currentStreak}</Typography>
                        : <Skeleton variant="circular" sx={{ display: 'block', height: '3.5rem', width: '3.5rem', textAlign: 'center', margin: '1rem auto' }} />
                }
                {
                    nextMileStone ?
                        <Typography variant="body2" fontWeight={'semi-bold'} component={'p'} color={'GrayText'} align="left">
                            MileStone: {nextMileStone.streakCount}
                        </Typography>
                        : <Skeleton variant="text" sx={{ width: '50%' }} />
                }
            </Paper>
            {
                longestStreak ?
                    <Typography variant="body2" component={'p'} color={'GrayText'} align="left" sx={{ marginTop: '0.25rem !important' }}>Longest: {longestStreak}</Typography>
                    : <Skeleton variant="text" sx={{ width: '40%' }} />
            }
            <Typography variant="body1" fontWeight={'bold'} component={'h5'}>This Week</Typography>
            <Paper sx={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                marginBottom: '1rem !important',
            }}>
                {(weeklyStreak || new Array(7).fill(false)).map((streakItem, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {
                            streakItem ?
                                <>
                                    {
                                        streakItem.isInStreak ?
                                            <Typography fontSize={'1.35rem'}>🔥</Typography> :
                                            <Chip sx={{ borderRadius: '1rem', height: '1.9rem', width: '1.9rem', fontSize: '1rem', padding: 0, marginBottom: '0.1rem' }} />
                                    }
                                </>
                                : <Skeleton variant="circular" sx={{height: '1.9rem', width: '1.9rem'}}/>
                        }

                        <Typography color={'GrayText'}>{streakItem.day}</Typography>
                    </Box>
                ))}
            </Paper>
        </>
    )
}

export default StreakCard