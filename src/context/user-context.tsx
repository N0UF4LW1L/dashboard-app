'use client';

import {
    createContext,
    useContext,
    ReactNode,
    useMemo,
    useState,
    useEffect,
} from 'react';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

type UserContextType = {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<AuthUser | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                setUserState(JSON.parse(stored));
            } catch {
                // ignore
            }
        }
    }, []);

    const setUser = (u: AuthUser | null) => {
        setUserState(u);
        if (u) {
            localStorage.setItem('user', JSON.stringify(u));
        } else {
            localStorage.removeItem('user');
        }
    };

    const value = useMemo(() => ({ user, setUser }), [user]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
