import React from 'react';
import { Home, Briefcase, FolderGit2, Code, User, Sun, Moon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
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

    return (
        // `layoutRoot` isolates Framer Motion layout animations to prevent buggy cross-page bounding box jumps.
        <motion.nav layoutRoot className={`backdrop-blur-md border-b fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950/85 border-zinc-800/80' : 'bg-white/90 border-zinc-200/90'}`}>
            <div className="flex items-center px-4 h-16">
                <div className="flex-1"></div>
                
                {/* Center Navigation Links */}
                <div className="relative flex gap-1">
                    {navigationLinks.map((link) => {
                        // A link is active if we are on its specific path, or if we are on the home page and its section is active.
                        const isActive = link.path ? pathname === link.path : (pathname === '/' && activeSection === link.id);

                        return (
                            <a
                                key={link.id}
                                id={`nav-link-${link.id}`}
                                href={link.path ? link.path : (pathname === '/' ? `#${link.id}` : `/#${link.id}`)}
                                onClick={(e) => {
                                    e.preventDefault();

                                    // Handle cross-page navigation directly
                                    if (link.path) {
                                        router.push(link.path);
                                        return;
                                    }

                                    // Handle intra-page scrolling (home page sections)
                                    if (pathname === '/') {
                                        // Lock the intersection observer so it doesn't fire wildly while scrolling down
                                        isManualScrolling.current = true;
                                        setActiveSection(link.id);
                                        window.history.replaceState(null, "", `#${link.id}`);
                                        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        setTimeout(() => { isManualScrolling.current = false; }, 2000);
                                    } else {
                                        // Handle routing back to home page sections from other pages
                                        isManualScrolling.current = true;
                                        setActiveSection(link.id);
                                        router.push(`/#${link.id}`);
                                        setTimeout(() => { isManualScrolling.current = false; }, 2000);
                                    }
                                }}
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
                                        // Appending pathname forces a unique layoutId per page, 
                                        // effectively disabling sliding animations across full page transitions.
                                        layoutId={`navbar-indicator-${pathname}`}
                                        className={`absolute inset-0 border rounded-lg -z-10 ${isDarkMode ? 'bg-violet-950/70 border-violet-700/50' : 'bg-zinc-200/75 border-zinc-300/80'}`}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                {link.icon} <span className="hidden sm:inline">{link.label}</span>
                            </a>
                        );
                    })}
                </div>
                
                {/* Right Side Actions */}
                <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
                    
                    {/* Resume CTA Button for Recruiters - Opens Live PDF Preview in new tab */}
                    <motion.a
                        href="/resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isDarkMode
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300 hover:bg-zinc-50'
                        }`}
                        aria-label="Preview & Download Resume (PDF)"
                        title="Preview & Download PDF (full_name_cv.pdf)"
                    >
                        <FileText size={13} className={isDarkMode ? 'text-violet-400' : 'text-violet-700'} />
                        <span className="hidden sm:inline">Resume</span>
                    </motion.a>

                    {/* Commission CTA Button (hidden)
                    <motion.a
                        href="/commission"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push('/commission');
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            pathname === '/commission'
                                ? isDarkMode 
                                    ? 'bg-violet-700 text-white shadow-violet-950/60' 
                                    : 'bg-violet-700 text-white shadow-violet-300'
                                : isDarkMode
                                    ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                        }`}
                    >
                        <Palette size={14} /> 
                        <span>Commission</span>
                    </motion.a>
                    */}

                    {/* Theme Toggle Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-violet-300' : 'bg-zinc-100 border-zinc-300 text-zinc-800'}`}
                        aria-label={isDarkMode ? "light theme" : "dark theme"}
                    >
                        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
}
