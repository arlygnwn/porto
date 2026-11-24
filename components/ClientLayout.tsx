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
        <div className={`relative min-h-screen overflow-x-clip font-sans antialiased scroll-smooth transition-colors duration-1000 ${isDarkMode ? 'bg-linear-to-br from-zinc-950 via-slate-950 to-purple-950/45 text-zinc-100' : 'bg-linear-to-b from-zinc-100 via-slate-100 to-zinc-200 text-zinc-900'}`}>
            
            {/* Global Background Glow Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {isDarkMode ? (
                    <>
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-purple-900/25 blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-purple-800/15 blur-[120px]" />
                    </>
                ) : (
                    <>
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-slate-300/40 blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-zinc-300/35 blur-[120px]" />
                    </>
                )}
            </div>

            {/* Persistent Navigation Bar */}
            <Navbar />

            {/* Main Page Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
