import { createContext } from 'react';
import useStoredReducer from 'src/hooks/useStoredReducer';
import { WorkoutSession } from 'src/models/WorkoutSession';
import SessionReducer, { SessionActionType } from 'src/reducers/SessionReducer';

type SessionEventType = (session: WorkoutSession) => void;

interface SessionContextType {
    sessionsList: Array<WorkoutSession>;
    latestSession: WorkoutSession;
    updateSession: SessionEventType
}

export const SessionContext = createContext<SessionContextType>({
    sessionsList: [],
    latestSession: WorkoutSession.getSession([], new Date()),
    updateSession: () => {},
});
export default function SessionProvider({ children }: { children: React.ReactNode }) {

    const [sessionsList, sessionDispatch] = useStoredReducer(
        'WORKOUT_SESSIONS',
        SessionReducer,
        [],
        (state) => ({ type: SessionActionType.INIT_SESSION, payload: state }),
    );

    /**
     * TODO: 
     * 1. Create a Stored State Hook
     * 2. Create a hook/util to get the latest session and store it
     * 3. Add a hook/util to create new session everyday
     */

    return (
        <SessionContext.Provider value={{
            sessionsList,
            latestSession: sessionsList[0],
            updateSession: (session: WorkoutSession) => sessionDispatch({ type: SessionActionType.UPDATE_SESSION, payload: [session] }),
        }}>
            {children}
        </SessionContext.Provider>
    );
}