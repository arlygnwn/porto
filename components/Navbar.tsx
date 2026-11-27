import React, { useState, useEffect } from 'react';
import { Home, Briefcase, FolderGit2, Code, User, Sun, Moon, FileText, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '@/providers/AppProvider';

/**
 * Definition of all navigation links shown in the Navbar.
 * For intra-page sections, provide just an `id`.
 * For entirely different pages, provide a `path`.
 */
export const navigationLinks: Array<{ label: string; id: string; icon: React.ReactNode; path?: string }> = [
    { label: "Home", id: "home", icon: <Home size={13} /> },
    { label: "Experience", id: "experience", icon: <Briefcase size={13} /> },
    { label: "Projects", id: "project", icon: <FolderGit2 size={13} /> },
    { label: "Skills", id: "skills", icon: <Code size={13} /> },
    { label: "Profile", id: "profile", icon: <User size={13} /> }
];

export default function Navbar() {
    const { activeSection, setActiveSection, isManualScrolling, isDarkMode, setIsDarkMode } = useAppContext();
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const activeLink = navigationLinks.find((link) =>
        link.path ? pathname === link.path : (pathname === '/' && activeSection === link.id)
    ) || navigationLinks[0];

    const handleNavClick = (e: React.MouseEvent, link: { label: string; id: string; path?: string }) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        if (link.path) {
            router.push(link.path);
            return;
        }

        if (pathname === '/') {
            isManualScrolling.current = true;
            setActiveSection(link.id);
            window.history.replaceState(null, "", `#${link.id}`);
            document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => { isManualScrolling.current = false; }, 2000);
        } else {
            isManualScrolling.current = true;
            setActiveSection(link.id);
            router.push(`/#${link.id}`);
            setTimeout(() => { isManualScrolling.current = false; }, 2000);
        }
    };

    return (
        <nav className={`border-b fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${isDarkMode ? 'bg-zinc-950/95 border-zinc-800/80' : 'bg-white/95 border-zinc-200/90'}`}>
            <div className="flex items-center justify-between px-3 sm:px-4 h-14 md:h-16 max-w-7xl mx-auto">
                {/* Mobile Left: Compact Brand + Current Section Indicator */}
                <div className="flex md:hidden items-center gap-2 min-w-0">
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, navigationLinks[0])}
                        className={`font-display font-extrabold text-sm tracking-tight shrink-0 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}
                    >
                        Arly
                    </a>
                    <span className={isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}>/</span>
                    <span className={`font-mono text-[11px] font-medium truncate ${isDarkMode ? 'text-violet-400' : 'text-violet-700'}`}>
                        {activeLink.label}
                    </span>
                </div>

                {/* Desktop Left Spacer */}
                <div className="hidden md:block flex-1" />
                
                {/* Desktop Center Navigation Links */}
                <div className="relative hidden md:flex gap-1">
                    {navigationLinks.map((link) => {
                        const isActive = link.path ? pathname === link.path : (pathname === '/' && activeSection === link.id);

                        return (
                            <a
                                key={link.id}
                                id={`nav-link-${link.id}`}
                                href={link.path ? link.path : (pathname === '/' ? `#${link.id}` : `/#${link.id}`)}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-300 z-10 ${isActive
                                        ? (isDarkMode ? 'text-violet-400 font-semibold' : 'text-violet-800 font-semibold')
                                        : isDarkMode
                                            ? "text-zinc-400 hover:text-zinc-200"
                                            : "text-zinc-600 hover:text-zinc-950"
                                    }`}
                            >
                                {/* Animated Active Pill Background */}
                                {isActive && (
                                    <motion.span
                                        layoutId={`navbar-indicator-${pathname}`}
                                        className={`absolute inset-0 border rounded-lg -z-10 ${isDarkMode ? 'bg-violet-950/70 border-violet-700/50' : 'bg-zinc-200/75 border-zinc-300/80'}`}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                {link.icon} <span>{link.label}</span>
                            </a>
                        );
                    })}
                </div>
                
                {/* Right Side Actions */}
                <div className="flex md:flex-1 justify-end items-center gap-1.5 sm:gap-2.5">
                    
                    {/* Resume CTA Button for Recruiters - Opens Live PDF Preview in new tab */}
                    <motion.a
                        href="/resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all border ${
                            isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300 hover:bg-zinc-50'
                        }`}
                        aria-label="Preview & Download Resume (PDF)"
                        title="Preview & Download PDF (full_name_cv.pdf)"
                    >
                        <FileText size={13} className={isDarkMode ? 'text-violet-400' : 'text-violet-700'} />
                        <span className="md:hidden">CV</span>
                        <span className="hidden md:inline">Resume</span>
                    </motion.a>

                    {/* Theme Toggle Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-1.5 md:p-2 rounded-lg md:rounded-xl border cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-violet-300' : 'bg-zinc-100 border-zinc-300 text-zinc-800'}`}
                        aria-label={isDarkMode ? "light theme" : "dark theme"}
                    >
                        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                    </motion.button>

                    {/* Mobile Menu Toggle Button */}
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className={`md:hidden p-1.5 rounded-lg border cursor-pointer transition-colors ${
                            isMobileMenuOpen
                                ? (isDarkMode ? 'bg-violet-950/70 border-violet-700/60 text-violet-300' : 'bg-violet-50 border-violet-300 text-violet-800')
                                : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700')
                        }`}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Dropdown Menu with Full Labels */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`md:hidden overflow-hidden border-t ${isDarkMode ? 'border-zinc-800/80 bg-zinc-950/95' : 'border-zinc-200/80 bg-white/95'}`}
                    >
                        <div className="px-3 py-2.5 flex flex-col gap-1">
                            {navigationLinks.map((link) => {
                                const isActive = link.path ? pathname === link.path : (pathname === '/' && activeSection === link.id);
                                return (
                                    <a
                                        key={link.id}
                                        href={link.path ? link.path : (pathname === '/' ? `#${link.id}` : `/#${link.id}`)}
                                        onClick={(e) => handleNavClick(e, link)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                            isActive
                                                ? (isDarkMode ? 'bg-violet-950/70 text-violet-300 border border-violet-700/40 font-semibold' : 'bg-violet-50 text-violet-800 border border-violet-200 font-semibold')
                                                : (isDarkMode ? 'text-zinc-300 hover:bg-zinc-900' : 'text-zinc-700 hover:bg-zinc-100')
                                        }`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </span>
                                        {isActive && (
                                            <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-violet-400' : 'bg-violet-700'}`} />
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
