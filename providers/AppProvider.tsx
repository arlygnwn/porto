"use client";

import React, { createContext, useContext, useState, useRef, ReactNode, MutableRefObject } from 'react';

interface AppContextType {
    // Global dark/light mode toggle state
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
    
    // Tracks the currently viewed section on the Home page (e.g., 'home', 'experience')
    activeSection: string;
    setActiveSection: (value: string) => void;
    
    // A lock used to prevent IntersectionObservers from updating the activeSection 
    // while the user is actively clicking a navigation link to scroll.
    isManualScrolling: MutableRefObject<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider wraps the entire application, providing global UI state
 * like theme, navigation position, and scrolling locks.
 */
export function AppProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    
    // Use a ref instead of state so we can mutate it instantly without causing re-renders
    const isManualScrolling = useRef(false);

    return (
        <AppContext.Provider value={{
            isDarkMode,
            setIsDarkMode,
            activeSection,
            setActiveSection,
            isManualScrolling
        }}>
            {children}
        </AppContext.Provider>
    );
}

/**
 * Custom hook for consuming the AppContext easily across components.
 */
export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
