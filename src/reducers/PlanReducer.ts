import { Plan } from "src/models/Plan";

export enum PlanActionType {
    INIT_PLAN = "INIT_PLAN",
    ADD_PLAN = "ADD_PLAN",
    UPDATE_PLAN = "UPDATE_PLAN",
    DELETE_PLAN = "DELETE_PLAN",
}

export interface PlanAction {
    type: PlanActionType,
    payload: Plan[]
};

export default function planReducer(state: Plan[], action: PlanAction) {
    switch (action.type) {
        case PlanActionType.INIT_PLAN:
            const restoreState = action.payload.map(planItem => {
                if('id' in planItem) return planItem;

                const rawJSON = JSON.parse(JSON.stringify(planItem));
                return Plan.fromJSON(rawJSON);
            })
            return restoreState;
        case PlanActionType.ADD_PLAN:
            state = [...state, ...action.payload];
            return state;
        case PlanActionType.UPDATE_PLAN:
            action.payload.forEach(planItem => {
                const updatedPlanIndex = state.findIndex(({id}) => planItem.id === id);
                state[updatedPlanIndex] = planItem;
            })
            return [...state];
        case PlanActionType.DELETE_PLAN:
            state = state.filter(({id}) => !action.payload.some(planItem => planItem.id === id));
            return state;
        default:
            return state;
    }
}