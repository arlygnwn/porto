"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/providers/AppProvider';
import Navbar from '@/components/Navbar';

/**
 * ClientLayout wraps the specific pages (like Home and Commission) 
 * and provides the persistent Navbar, glowing background effects, 
 * and dark/light mode transition styling. 
 * For dedicated document views such as /resume, it renders clean children without
 * the global Navbar or background effects to prevent toolbar overlap.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useAppContext();
    const pathname = usePathname();
    const isResumePage = Boolean(pathname?.startsWith('/resume'));

    // Dedicated document views (like /resume) provide their own toolbar and layout
    if (isResumePage) {
        return <>{children}</>;
    }

    return (
        <div
            className={`relative min-h-screen overflow-x-clip font-sans antialiased transition-colors duration-200 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'}`}
            style={{
                backgroundImage: isDarkMode
                    ? 'radial-gradient(circle at 0% 0%, rgba(88, 28, 135, 0.22), transparent 55%), radial-gradient(circle at 100% 100%, rgba(107, 33, 168, 0.14), transparent 50%)'
                    : 'radial-gradient(circle at 0% 0%, rgba(203, 213, 225, 0.45), transparent 55%), radial-gradient(circle at 100% 100%, rgba(212, 212, 216, 0.4), transparent 50%)'
            }}
        >
            {/* Persistent Navigation Bar */}
            <Navbar />

            {/* Main Page Content (no z-index so fixed modals inside pages can stack above Navbar) */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
}
