import React from 'react';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectsProps {
    isDarkMode: boolean;
    projects: any[];
    onProjectClick: (projectId: string) => void;
    onExploreClick: () => void;
}

export default function Projects({
    isDarkMode,
    projects = [],
    onProjectClick,
    onExploreClick
}: ProjectsProps) {
    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
    
    // Showcase only the top 6 projects on the main landing page
    const showcaseProjects = projects.slice(0, 6);

    return (
        <section
            id="project"
            className="w-full sm:min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-14 sm:py-24 relative overflow-hidden"
        >
            {/* Background glowing orb */}
            <div className="absolute top-0 right-0 w-120 h-120 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Area */}
            <ScrollReveal className="mb-8 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 w-full max-w-6xl mx-auto relative z-10">
                <div>
                    <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Featured Projects</h2>
                    <div className={`h-1 w-16 sm:w-20 mt-3 sm:mt-4 rounded-full ${isDarkMode ? 'bg-purple-500/60' : 'bg-purple-700/40'}`} />
                    <p className={`text-xs sm:text-base mt-3 sm:mt-6 font-medium ${textMuted}`}>A snapshot of my latest architectural designs and engineering builds.</p>
                </div>
            </ScrollReveal>

            {/* Grid Area */}
            <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-12 z-10">
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full mx-auto">
                    <AnimatePresence mode="popLayout">
                        {showcaseProjects.map((project, idx) => {
                            // First project is featured (larger width) if there are enough projects
                            const isFeatured = idx === 0 && showcaseProjects.length > 2;
                            
                            return (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    whileHover={{ y: -6, scale: 1.015 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 320,
                                        damping: 24
                                    }}
                                    onClick={() => onProjectClick(project.id)}
                                    className={`border rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl group cursor-pointer
                                        ${isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}
                                        transition-[border-color,box-shadow] duration-500
                                        ${isDarkMode
                                            ? 'bg-zinc-900/40 border-zinc-800/60 hover:border-purple-500/30 hover:bg-zinc-900/60 hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)]'
                                            : 'bg-white/75 border-zinc-200/80 hover:border-purple-700/30 hover:bg-white/90 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]'
                                        }
                                    `}
                                >
                                    {/* Neon ambient glow lines */}
                                    <div className={`absolute inset-0 rounded-3xl sm:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 ${isDarkMode ? 'bg-radial-[at_0%_100%] from-purple-500/10 via-transparent to-transparent' : 'bg-radial-[at_0%_100%] from-purple-700/5 via-transparent to-transparent'}`} />

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className={`font-mono text-[10px] font-bold tracking-widest uppercase border px-2.5 sm:px-3 py-1 rounded-full truncate max-w-[70%] ${isDarkMode ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-800 bg-purple-50 border-purple-200'}`}>
                                                {project.company}
                                            </span>
                                            <span className={`font-mono text-[11px] sm:text-xs font-medium shrink-0 mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{project.period}</span>
                                        </div>

                                        <h3 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug ${isDarkMode ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'} transition-colors duration-300`}>
                                            {project.name}
                                        </h3>
                                    </div>

                                    <div className={`pt-4 sm:pt-6 mt-5 sm:mt-8 border-t flex flex-col gap-3 sm:gap-4 justify-end ${isDarkMode ? 'border-zinc-800/40' : 'border-zinc-200/60'}`}>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.tech && project.tech.map((t: string) => (
                                                <span 
                                                    key={t} 
                                                    className={`px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-[11px] font-medium rounded-lg transition-colors ${
                                                        isDarkMode 
                                                        ? 'bg-zinc-800/50 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-zinc-300' 
                                                        : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-800'
                                                    }`}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-xs pt-2">
                                            <span className={`font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-purple-400 group-hover:text-purple-300' : 'text-purple-800 group-hover:text-purple-900'}`}>
                                                View Details <ArrowUpRight size={14} />
                                            </span>
                                            <span className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                                {project.experience_id ? 'Professional' : project.education_id ? 'Academic' : 'Standalone'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Explore More Button */}
                {projects.length > 6 && (
                    <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onExploreClick}
                        className={`px-8 py-4 rounded-3xl border text-xs font-extrabold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-2.5 ${
                            isDarkMode 
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800 hover:shadow-lg' 
                            : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-lg'
                        }`}
                    >
                        <FolderGit2 size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-800'} />
                        Explore Full Library
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>
                            {projects.length}
                        </span>
                    </motion.button>
                )}
            </div>
        </section>
    );
}
