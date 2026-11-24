import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowUpRight } from 'lucide-react';

interface ProjectLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredProjects: any[];
    onProjectClick: (projectId: string) => void;
}

export default function ProjectLibraryModal({
    isOpen,
    onClose,
    isDarkMode,
    searchQuery,
    setSearchQuery,
    filteredProjects = [],
    onProjectClick
}: ProjectLibraryModalProps) {
    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const modalBg = isDarkMode 
        ? 'bg-zinc-950/95 border-zinc-900' 
        : 'bg-zinc-50/95 border-zinc-200';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                    className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-6 backdrop-blur-xl bg-black/70 cursor-pointer overflow-hidden"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className={`w-full max-w-6xl h-[90vh] md:h-[85vh] border rounded-[2.5rem] flex flex-col cursor-default relative overflow-hidden backdrop-blur-3xl shadow-2xl ${modalBg}`}
                    >
                        {/* Glow effects */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                            {isDarkMode ? (
                                <>
                                    <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-purple-900/15 blur-[100px]" />
                                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-purple-900/10 blur-[100px]" />
                                </>
                            ) : (
                                <>
                                    <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-slate-300/25 blur-[100px]" />
                                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-zinc-300/20 blur-[100px]" />
                                </>
                            )}
                        </div>

                        {/* Top Bar (Sticky/Fixed in Modal Layout) */}
                        <div className={`p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b relative z-10 ${isDarkMode ? 'border-zinc-900/80 bg-zinc-950/20' : 'border-zinc-200/60 bg-zinc-50/20'}`}>
                            <div>
                                <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                                    Project Library
                                </h2>
                                <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                                    Full Catalogue ({filteredProjects.length} Projects)
                                </p>
                            </div>

                            <div className="flex items-center gap-4 flex-1 max-w-md">
                                <div className="relative w-full group">
                                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 -z-10 blur-md ${isDarkMode ? 'bg-purple-500/20 opacity-0 group-focus-within:opacity-100' : 'bg-purple-700/10 opacity-0 group-focus-within:opacity-100'}`} />
                                    <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isDarkMode ? 'text-zinc-400 group-focus-within:text-purple-400' : 'text-zinc-600 group-focus-within:text-purple-800'}`} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, company, stack..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-11 pr-10 py-3.5 border rounded-2xl font-sans text-sm transition-all tracking-wide focus:outline-none backdrop-blur-xl ${
                                            isDarkMode 
                                            ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-200 placeholder-zinc-600 focus:border-purple-500/50 focus:bg-zinc-900/80' 
                                            : 'bg-white/80 border-zinc-200/80 text-zinc-800 placeholder-zinc-400 focus:border-purple-700/40 focus:bg-white shadow-sm'
                                        }`}
                                    />
                                    <AnimatePresence>
                                        {searchQuery && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSearchQuery("")}
                                                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-700 hover:bg-zinc-100'}`}
                                            >
                                                <X size={14} />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <button
                                    onClick={onClose}
                                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${isDarkMode ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900' : 'border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-white shadow-sm'}`}
                                    aria-label="Close library"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Scrolling Container for Projects Grid */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
                            {filteredProjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence mode="popLayout">
                                        {filteredProjects.map((project) => (
                                            <motion.div
                                                key={project.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                whileHover={{ y: -4, scale: 1.01 }}
                                                onClick={() => onProjectClick(project.id)}
                                                className={`border rounded-[2rem] p-7 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl group cursor-pointer transition-[border-color,box-shadow] duration-500 ${
                                                    isDarkMode
                                                        ? 'bg-zinc-900/40 border-zinc-800/60 hover:border-purple-500/30 hover:bg-zinc-900/60 hover:shadow-lg'
                                                        : 'bg-white/75 border-zinc-200/80 hover:border-purple-700/30 hover:bg-white/95 hover:shadow-md'
                                                }`}
                                            >
                                                <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 ${isDarkMode ? 'bg-radial-[at_0%_100%] from-purple-500/10 via-transparent to-transparent' : 'bg-radial-[at_0%_100%] from-purple-700/5 via-transparent to-transparent'}`} />

                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between gap-3 font-sans">
                                                        <span className={`text-[10px] font-bold tracking-widest uppercase border px-2.5 py-0.5 rounded-full truncate max-w-[70%] ${isDarkMode ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-800 bg-purple-50 border-purple-200'}`}>
                                                            {project.company}
                                                        </span>
                                                        <span className={`text-xs font-semibold shrink-0 mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{project.period}</span>
                                                    </div>

                                                    <h3 className={`text-xl font-black tracking-tight leading-snug ${isDarkMode ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'} transition-colors duration-300`}>
                                                        {project.name}
                                                    </h3>
                                                </div>

                                                <div className={`pt-5 mt-5 border-t flex flex-col gap-3 justify-end ${isDarkMode ? 'border-zinc-800/40' : 'border-zinc-200/60'}`}>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {project.tech && project.tech.slice(0, 3).map((t: string) => (
                                                            <span key={t} className={`px-2 py-0.5 font-sans text-[10px] font-medium rounded-md transition-colors ${isDarkMode ? 'bg-zinc-800/50 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>{t}</span>
                                                        ))}
                                                        {project.tech && project.tech.length > 3 && (
                                                            <span className={`px-2 py-0.5 font-sans text-[10px] font-medium rounded-md ${isDarkMode ? 'bg-zinc-800/50 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>+{project.tech.length - 3} more</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] pt-1">
                                                        <span className={`font-semibold uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                                                            View Details
                                                        </span>
                                                        <ArrowUpRight size={12} className={`opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`border rounded-[2.5rem] p-16 text-center font-sans tracking-wide space-y-4 max-w-2xl mx-auto backdrop-blur-xl shadow-inner ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'}`}
                                >
                                    <div className="text-lg font-medium">No matching projects found for: <span className={isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}>&quot;{searchQuery}&quot;</span></div>
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className={`px-6 py-2.5 rounded-xl border text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${isDarkMode ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 hover:text-purple-900'}`}
                                    >
                                        Reset Search
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
