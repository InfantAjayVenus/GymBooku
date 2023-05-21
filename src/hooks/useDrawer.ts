import { useState } from "react";

export default function useDrawer(initialDrawState:Boolean = false) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(initialDrawState);

    return {
        isOpen: isDrawerOpen,
        open: () => {
            setIsDrawerOpen(true);
        },
        close: () => {
            setIsDrawerOpen(false);
        },
        toggle: () => {
            setIsDrawerOpen(!isDrawerOpen);
        }
    }
}