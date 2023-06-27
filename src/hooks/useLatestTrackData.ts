import { useEffect, useState } from "react";
import { PairedTrackRecord, WorkoutTrackCollection } from "src/models/WorkoutRecord";
import isTimestampToday from "src/utils/isTimestampToday";

export default function useLatestTrackData(allCollectedData: WorkoutTrackCollection[]): PairedTrackRecord[] {
    const [pairedRecords, setPairedRecords] = useState([] as PairedTrackRecord[]);

    useEffect(() => {
        const todayData = allCollectedData.filter(trackedRecord => isTimestampToday(trackedRecord.timestamp));

        const latestData = Object.entries(
            allCollectedData.filter(trackRecord => !isTimestampToday(trackRecord.timestamp))
                .reduce((workoutCollection, trackRecord) => {
                    if(
                        !workoutCollection[trackRecord.workout as string] || 
                        (
                            workoutCollection[trackRecord.workout as string] && 
                            (trackRecord.timestamp.valueOf() > workoutCollection[trackRecord.workout as string].timestamp.valueOf())
                        )
                    ) {
                        workoutCollection[trackRecord.workout as string] = trackRecord;
                    }
                    return workoutCollection;
                }, {} as Record<string, WorkoutTrackCollection>)
        ).map(([workout, trackRecord]) => {
            const today = todayData.find(trackRecord => trackRecord.workout === workout) || new WorkoutTrackCollection(workout);

            return {today, previous: trackRecord};
        })

        setPairedRecords(latestData);

    }, [allCollectedData]);

    return pairedRecords;
}