import { createContext, ReactNode } from "react";
import { TEST_PLANS } from "src/data.mock";
import useStoredReducer from "src/hooks/useStoredReducer";
import { Plan } from "src/models/Plan";
import planReducer, { PlanActionType } from "src/reducers/PlanReducer";

type PlanEventType = (plan: Plan) => void

interface PlanContextType {
  plansList: Plan[],
  addPlan: PlanEventType,
  updatePlan: PlanEventType,
  deletePlan: PlanEventType,
}

const PLAN_VERSION = '1.0';
const INITIAL_PLANS = import.meta.env.DEV ? TEST_PLANS : [];
export const PlanContext = createContext<PlanContextType>({
  plansList: [] as Plan[],
  addPlan: (_: Plan) => {},
  updatePlan: (_: Plan) => {},
  deletePlan: (_: Plan) => {},
});


export default function PlanProvider({ children }: { children: ReactNode }) {

  const [plansList, planDispatch] = useStoredReducer(
    `WORKOUT_PLAN_${PLAN_VERSION}`,
    planReducer,
    INITIAL_PLANS,
    (state) => ({ type: PlanActionType.INIT_PLAN, payload: state })
  )
  return (
    <PlanContext.Provider value={{
      plansList,
      addPlan: (plan: Plan) => planDispatch({ type: PlanActionType.ADD_PLAN, payload: [plan] }),
      updatePlan: (plan: Plan) => planDispatch({ type: PlanActionType.UPDATE_PLAN, payload: [plan] }),
      deletePlan: (plan: Plan) => planDispatch({ type: PlanActionType.DELETE_PLAN, payload: [plan] })
    }}>{children}</PlanContext.Provider>
  )
}