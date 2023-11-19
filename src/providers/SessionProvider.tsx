import { createContext, useContext, useEffect } from 'react';
import useStoredReducer from 'src/hooks/useStoredReducer';
import { WorkoutSession } from 'src/models/WorkoutSession';
import SessionReducer, { SessionActionType } from 'src/reducers/SessionReducer';
import compareDatesOnly from 'src/utils/compareDatesOnly';
import { ConfigContext } from './ConfigProvider';
import { PlanContext } from './PlanProvider';

type SessionEventType = (session: WorkoutSession) => void;

interface SessionContextType {
    sessionsList: Array<WorkoutSession>;
    latestSession: WorkoutSession;
    updateSession: SessionEventType
}

export const SessionContext = createContext<SessionContextType>({
    sessionsList: [],
    latestSession: WorkoutSession.getSession([], new Date()),
    updateSession: () => { },
});
export default function SessionProvider({ children }: { children: React.ReactNode }) {

    const { config, updateConfig } = useContext(ConfigContext);
    const { plansList } = useContext(PlanContext);
    const latestSession = config.configData.latestSession || WorkoutSession.getSession(plansList, new Date());
    const [sessionsList, sessionDispatch] = useStoredReducer(
        'WORKOUT_SESSIONS',
        SessionReducer,
        [],
        (state) => ({ type: SessionActionType.INIT_SESSION, payload: state }),
    );

    useEffect(() => {
        if (!sessionsList.map((item) => item.id).includes(latestSession.id)) return;

        updateConfig({ configData: { latestSession: WorkoutSession.getSession(plansList, new Date()) } });
    }, [sessionsList]);

    useEffect(() => {
        updateConfig({ configData: { latestSession: latestSession.getUpdatedSession(plansList) } });
    }, [plansList])

    if (!compareDatesOnly(latestSession.sessionDate, new Date())) {
        sessionDispatch({ type: SessionActionType.ADD_SESSION, payload: [latestSession] });
    }

    return (
        <SessionContext.Provider value={{
            sessionsList,
            latestSession,
            updateSession: (session: WorkoutSession) => sessionDispatch({ type: SessionActionType.UPDATE_SESSION, payload: [session] }),
        }}>
            {children}
        </SessionContext.Provider>
    );
}