import { Weight, WeightCollection } from "src/models/WeightCollection";

export enum WeightReducerActionType {
    INIT_WEIGHT = "INIT_WEIGHT",
    UPDATE_WEIGHT = "UPDATE_WEIGHT"
}

export interface WeightAction {
    type: WeightReducerActionType,
    payload: WeightCollection,
}

export default function weightReducer(state: WeightCollection, action: WeightAction) {
    switch (action.type) {
        case WeightReducerActionType.INIT_WEIGHT: {
            if('id' in action.payload) return action.payload;
            const rawJson = JSON.parse(JSON.stringify(action.payload));
            console.log('DEBUG:RAW_WEIGHT:', rawJson);
            
            return new WeightCollection(
                rawJson._weights.map((rawWeight: any) => new Weight(
                    rawWeight._weightValue,
                    new Date(rawWeight._timestamp),
                    rawWeight._id
                )),
                rawJson._id,
                rawJson._goal,
                rawJson._duration
            );
        }
        case WeightReducerActionType.UPDATE_WEIGHT: {
            return action.payload;
        }
        default:
            return state;
    }
}