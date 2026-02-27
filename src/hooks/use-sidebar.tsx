'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

const SIDEBAR_KEY = 'sidebarMinimized';

type SidebarContextType = {
    isMinimized: boolean;
    toggle: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
    isMinimized: false,
    toggle: () => { },
});

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(SIDEBAR_KEY);
        if (stored !== null) {
            setIsMinimized(JSON.parse(stored));
        }
    }, []);

    const toggle = () => {
        setIsMinimized((prev) => {
            const next = !prev;
            localStorage.setItem(SIDEBAR_KEY, JSON.stringify(next));
            return next;
        });
    };

    return (
        <SidebarContext.Provider value={{ isMinimized, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
