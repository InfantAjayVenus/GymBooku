import { get, set, update } from "idb-keyval";
import { Dispatch, useEffect, useReducer } from "react";

export default function useStoredReducer<S, A>(
    storeKey: IDBValidKey,
    reducer: (state: S, action: A) => S,
    initialState: S,
    initializeActionGenerator: (restoreState: S) => A
): [S, Dispatch<A>] {
    const [state, dispatch] = useReducer((state: S, action: A) => {
        const reducedState = reducer(state, action);

        const updatedState = getDeepCleanedObject(reducedState as Object);
        console.log(`DEBUG:${storeKey}`, updatedState);

        update(storeKey, () => updatedState)
            .catch(err => console.log(storeKey, updatedState, err));
        return reducedState;
    }, initialState);


    useEffect(() => {
        (async () => {
            const storedData = await get(storeKey);
            if (!storedData) {
                set(storeKey, initialState);
            } else {
                dispatch(initializeActionGenerator(storedData));
            }
        })();
    }, [])

    return [state as S, dispatch as Dispatch<A>];
}

function getDeepCleanedObject(object: any, debug = false): any {
    debug && console.log('DEBUG:OBJECT:', typeof object, object instanceof Array);

    if (object instanceof Array) return object.map(value => getDeepCleanedObject(value));
    if (typeof object !== 'object') return object;
    if (object instanceof Date) return object;

    return Object.fromEntries(
        Object.entries(object)
            .filter(([_, value]) => (typeof value).toLowerCase() !== 'function')
            .map(([key, value]) => {
                if ((typeof value).toLowerCase() === 'object') return (
                    [key, getDeepCleanedObject(value)]
                );

                return [key, value];
            })
    )
}