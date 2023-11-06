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

        const updatedState = getDeepCleanedObject(reducedState);

        update(storeKey, () => updatedState)
            .catch(err => console.log(storeKey, updatedState, err));
        return reducedState;
    }, initialState);


    useEffect(() => {
        (async () => {
            const storedData = await get(storeKey);
            if (!storedData) {
                set(storeKey, getDeepCleanedObject(initialState));
            } else {
                dispatch(initializeActionGenerator(storedData));
            }
        })();
    }, [])

    return [state as Storable, dispatch as Dispatch<A>];
}

function getDeepCleanedObject(object: any): any {

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