import { get, set, update } from "idb-keyval";
import { Dispatch, useEffect, useReducer } from "react";

export default function useStoredReducer<S, A>(
    storeKey: IDBValidKey, 
    reducer: (state: S, action: A) => S, 
    initialState: S, 
    initializeActionGenerator: (restoreState:S) => A
):[S, Dispatch<A>] {
    const [state, dispatch] = useReducer((state: S, action: A) => {
        const updatedState = reducer(state, action);
        update(storeKey, () => updatedState);
        return updatedState;
    }, initialState);
    

    useEffect(() => {
        (async () => {
            const storedData = await get(storeKey);
            if (!storedData) {
                set(storeKey, initialState);
            }else {
                dispatch(initializeActionGenerator(storedData));
            }
        })();
    }, [])

    return [state as S, dispatch as Dispatch<A>];
}