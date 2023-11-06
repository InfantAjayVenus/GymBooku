import { get, set, update } from "idb-keyval";
import { Dispatch, useEffect, useReducer } from "react";

export interface Storable {
    fromJSON(rawJSON: any): Storable;
}

export default function useStoredReducer<Storable, A>(
    storeKey: IDBValidKey,
    reducer: (state: Storable, action: A) => Storable,
    initialState: Storable,
    initializeActionGenerator: (restoreState: Storable) => A
): [Storable, Dispatch<A>] {
    const [state, dispatch] = useReducer((state: Storable, action: A) => {
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

    return [state as Storable, dispatch as Dispatch<A>];
}
