import { WeightCollection } from "src/models/WeightCollection";

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
            
            return WeightCollection.fromJSON(rawJson);
        }
        case WeightReducerActionType.UPDATE_WEIGHT: {
            return action.payload;
        }
        default:
            return state;
    }
}