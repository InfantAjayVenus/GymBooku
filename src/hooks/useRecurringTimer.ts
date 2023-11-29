import { useEffect, useRef } from "react";

export default function useRecurringTimer(callback: () => void, delay: number) {
    const savedCallback = useRef<() => void>(() => {});

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
            setTimeout(tick, delay);
        };

        const timerId = setTimeout(tick, delay);

        return () => clearTimeout(timerId);
    }, [delay]);
}