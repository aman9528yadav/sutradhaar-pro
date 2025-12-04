"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(prev => !prev);

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext must be used within SidebarProvider');
    }
    return context;
}
