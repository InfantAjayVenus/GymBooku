import { Dispatch, useEffect, useReducer } from "react";

export default function useStoredReducer<StateType, ActionType>(
    storeKey: string,
    reducer: (state: StateType, action: ActionType) => StateType,
    initialState: StateType,
    initializeActionGenerator: (restoreState: StateType) => ActionType
): [StateType, Dispatch<ActionType>] {
    const [state, dispatch] = useReducer((state: StateType, action: ActionType) => {
        const reducedState = reducer(state, action);

        const updatedState = JSON.parse(JSON.stringify(reducedState));

        localStorage.setItem(storeKey, JSON.stringify(updatedState));
        return reducedState;
    }, initialState);


    useEffect(() => {
        (async () => {
            const storedData = await localStorage.getItem(storeKey);
            if (!storedData) {
                localStorage.setItem(storeKey, JSON.stringify(initialState));
            } else {
                dispatch(initializeActionGenerator(JSON.parse(storedData)));
            }
        })();
    }, [])

    return [state as StateType, dispatch as Dispatch<ActionType>];
}
