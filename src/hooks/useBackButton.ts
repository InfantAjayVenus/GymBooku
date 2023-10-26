//create a hook to track the back button event and assign handler

import { useCallback, useEffect } from "react";

export default function useBackButton(handler: (event?: PopStateEvent) => void): void {
    const handleBack = useCallback((event?: PopStateEvent) => {
        handler(event);
    }, [handler]);

    useEffect(() => {
        window.addEventListener("popstate", (event: PopStateEvent) => {
            event.preventDefault();
            event.stopPropagation();

            handleBack(event);
        });
        return () => {
            window.removeEventListener("popstate", handleBack);
        };
    });
}
