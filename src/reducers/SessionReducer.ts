import { WorkoutSession } from "src/models/WorkoutSession";

export enum SessionActionType {
    INIT_SESSION = 'INIT_SESSION',
    ADD_SESSION = 'ADD_SESSION',
    UPDATE_SESSION = 'UPDATE_SESSION',
    DELETE_SESSION = 'DELETE_SESSION'
}

export interface SessionAction {
    type: SessionActionType;
    payload: WorkoutSession[];
}

export default function SessionReducer(state: WorkoutSession[], action: SessionAction) {
    switch (action.type) {
        case SessionActionType.INIT_SESSION: {
            const initState = action.payload.map((sessionItem: any) => {
                if('id' in sessionItem) return sessionItem;
                const rawJSON = JSON.parse(JSON.stringify(sessionItem));
                return WorkoutSession.fromJSON(rawJSON)
            })
            return initState;
        }
        case SessionActionType.ADD_SESSION: {
            state = [...state, ...action.payload];
            return state;
        }
        case SessionActionType.UPDATE_SESSION: {
            action.payload.forEach(sessionItem => {
                const updatedSessionIndex = state.findIndex(({id}) => sessionItem.id === id);
                state[updatedSessionIndex] = sessionItem;
            })
            return [...state];
        }
        case SessionActionType.DELETE_SESSION: {
            state = state.filter(({id}) => !action.payload.some(sessionItem => sessionItem.id === id));
            return state;
        }
        default: {
            return state;
        }
    }
}