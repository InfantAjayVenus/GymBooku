import { Plan } from "src/models/Plan";

export enum PlanActionType {
    ADD_PLAN = "ADD_PLAN",
    UPDATE_PLAN = "UPDATE_PLAN",
    DELETE_PLAN = "DELETE_PLAN",
}

export interface PlanAction {
    type: PlanActionType,
    payload: Plan
};

export default function planReducer(state: Plan[], action: PlanAction) {
    switch (action.type) {
        case PlanActionType.ADD_PLAN:
            state = [...state, action.payload];
            return state;
        case PlanActionType.UPDATE_PLAN:
            const updatedPlanIndex = state.findIndex(({id}) => action.payload.id === id);
            state[updatedPlanIndex] = action.payload;
            return [...state];
        case PlanActionType.DELETE_PLAN:
            state = state.filter(({id}) => id !== action.payload.id);
            return state;
        default:
            return state;
    }
}