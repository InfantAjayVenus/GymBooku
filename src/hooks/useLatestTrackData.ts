import { useEffect, useState } from "react";
import { PairedTrackRecord, WorkoutTrackCollection } from "src/models/WorkoutRecord";
import isTimestampToday from "src/utils/isTimestampToday";

export default function useLatestTrackData(allCollectedData: WorkoutTrackCollection[]): PairedTrackRecord[] {
    const [pairedRecords, setPairedRecords] = useState([] as PairedTrackRecord[]);

    useEffect(() => {
        const todayData = allCollectedData.filter(trackedRecord => isTimestampToday(trackedRecord.timestamp));

        const latestData = todayData.map(dataItem => {
            const workoutSpecificData = allCollectedData.filter(({ workout, id }) => dataItem.workout === workout && dataItem.id !== id);

            try {
                const latestRecord = workoutSpecificData.reduce((latest, item) => {
                    if (!latest) return item;

                    if (latest && latest?.timestamp.valueOf() < item.timestamp.valueOf()) {
                        return item;
                    }

                    return latest;
                })

                return {
                    today: dataItem,
                    previous: latestRecord
                } as PairedTrackRecord;
            } catch (error) {
                return {
                    today: dataItem
                }
            }
        })

        setPairedRecords(latestData);

    }, [allCollectedData]);

    return pairedRecords;
}