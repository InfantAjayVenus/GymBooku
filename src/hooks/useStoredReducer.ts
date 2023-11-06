import { get, set, update } from "idb-keyval";
import { Dispatch, useEffect, useReducer } from "react";

export default function useStoredReducer<StateType, ActionType>(
    storeKey: IDBValidKey,
    reducer: (state: StateType, action: ActionType) => StateType,
    initialState: StateType,
    initializeActionGenerator: (restoreState: StateType) => ActionType
): [StateType, Dispatch<ActionType>] {
    const [state, dispatch] = useReducer((state: StateType, action: ActionType) => {
        const reducedState = reducer(state, action);

        const updatedState = JSON.parse(JSON.stringify(reducedState));

        update(storeKey, () => updatedState)
            .catch(err => console.log(storeKey, updatedState, err));
        return reducedState;
    }, initialState);


    useEffect(() => {
        (async () => {
            const storedData = await get(storeKey);
            if (!storedData) {
                set(storeKey, JSON.parse(JSON.stringify(initialState)));
            } else {
                dispatch(initializeActionGenerator(storedData));
            }
        })();
    }, [])

    return [state as StateType, dispatch as Dispatch<ActionType>];
}
