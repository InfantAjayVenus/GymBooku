import { createContext, useContext, useEffect } from 'react';
import useStoredReducer from 'src/hooks/useStoredReducer';
import useStoredState from 'src/hooks/useStoredState';
import { WorkoutSession } from 'src/models/WorkoutSession';
import SessionReducer, { SessionActionType } from 'src/reducers/SessionReducer';
import { ID } from 'src/utils/getRandomId';
import { PlanContext } from './PlanProvider';

type SessionEventType = (session: WorkoutSession) => void;

interface SessionContextType {
    sessionsList: Array<WorkoutSession>;
    currentSession?: WorkoutSession;
    addSession: SessionEventType
    updateSession: SessionEventType
}

export const SessionContext = createContext<SessionContextType>({
    sessionsList: [],
    currentSession: WorkoutSession.getSession([], new Date()),
    addSession: () => { },
    updateSession: () => { },
});
export default function SessionProvider({ children }: { children: React.ReactNode }) {

    const { plansList } = useContext(PlanContext);
    const [sessionsList, sessionDispatch, hasSessionLoaded] = useStoredReducer(
        'WORKOUT_SESSIONS',
        SessionReducer,
        [],
        (state) => ({ type: SessionActionType.INIT_SESSION, payload: state }),
    );
    const [currentSessionId, setCurrentSessionId] = useStoredState<ID>(
        '',
        'WORKOUT_CURRENT_SESSION',
        (id) => id
    );

    useEffect(() => {
        if(!hasSessionLoaded) return;
        const currentSession = sessionsList.find(item => item.id === currentSessionId);
        if (!currentSession) return;

        sessionDispatch({ type: SessionActionType.UPDATE_SESSION, payload: [currentSession.updateSessionByPlan(plansList)] })
    }, [plansList]);


    return (
        <SessionContext.Provider value={{
            sessionsList,
            currentSession: sessionsList.find(session => session.id === currentSessionId),
            addSession: (session: WorkoutSession) => {
                sessionDispatch({type: SessionActionType.ADD_SESSION, payload: [session]});
                setCurrentSessionId(session.id);
            },
            updateSession: (session: WorkoutSession) => sessionDispatch({ type: SessionActionType.UPDATE_SESSION, payload: [session] }),
        }}>
            {children}
        </SessionContext.Provider>
    );
}