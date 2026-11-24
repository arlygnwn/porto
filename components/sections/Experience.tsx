import React, { useRef, useEffect } from 'react';
import { FolderGit2, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { motion } from 'framer-motion';

interface ExperienceProps {
    isDarkMode: boolean;
    experiences: any[];
    projectLibrary: any[];
    handleProjectClick: (projectId: string) => void;
}

export default function Experience({
    isDarkMode,
    experiences,
    projectLibrary,
    handleProjectClick
}: ExperienceProps) {
    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Sort chronologically from oldest (start) to current (latest)
    const chronologicalExperiences = [...experiences].sort((a, b) => {
        const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return timeA - timeB;
    });

    // Auto-scroll so the current/latest experience is centered in view
    useEffect(() => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const centerActive = () => {
            const activeCard = container.querySelector<HTMLElement>('[data-active-card="true"]') 
                || (container.lastElementChild as HTMLElement);
            if (activeCard) {
                const targetScrollLeft = activeCard.offsetLeft - (container.clientWidth - activeCard.clientWidth) / 2;
                container.scrollTo({
                    left: Math.max(0, targetScrollLeft),
                    behavior: 'instant' as ScrollBehavior
                });
            }
        };

        const timer = setTimeout(centerActive, 150);
        window.addEventListener('resize', centerActive);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', centerActive);
        };
    }, [experiences.length]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 400;
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section id="experience" className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden">
            {/* Background glowing orb for depth */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-6xl mx-auto mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
                <ScrollReveal>
                    <h2 className={`text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Professional Journey</h2>
                    <div className={`h-1 w-20 mt-4 rounded-full ${isDarkMode ? 'bg-purple-500/60' : 'bg-purple-700/40'}`} />
                    <p className={`text-sm mt-3 font-medium ${textMuted}`}>Chronological roadmap from early milestones to current roles.</p>
                </ScrollReveal>

                {/* Horizontal Navigation Buttons */}
                {chronologicalExperiences.length > 1 && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => scroll('left')}
                            className={`p-3 rounded-2xl border transition-colors shadow-sm cursor-pointer ${
                                isDarkMode 
                                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-black'
                            }`}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => scroll('right')}
                            className={`p-3 rounded-2xl border transition-colors shadow-sm cursor-pointer ${
                                isDarkMode 
                                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-black'
                            }`}
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Horizontal Timeline Container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                <div
                    ref={scrollContainerRef}
                    className="relative flex overflow-x-auto pb-8 pt-4 px-4 scroll-smooth select-none no-scrollbar"
                    style={{ 
                        scrollSnapType: 'x mandatory',
                        paddingLeft: 'max(1rem, calc(50% - 230px))',
                        paddingRight: 'max(1rem, calc(50% - 230px))'
                    }}
                >
                    {chronologicalExperiences.map((exp, idx) => {
                        const isLatest = idx === chronologicalExperiences.length - 1;
                        const isFirst = idx === 0;
                        const isCurrentActive = !exp.endDate || isLatest;

                        return (
                            <div
                                key={idx}
                                data-active-card={isCurrentActive ? "true" : "false"}
                                className="relative shrink-0 w-[85vw] sm:w-[420px] md:w-[460px] flex flex-col pt-10 px-4"
                                style={{ scrollSnapAlign: 'center' }}
                            >
                                {/* Left half line connecting to previous card */}
                                {!isFirst && (
                                    <div
                                        className={`absolute top-2.5 left-0 right-1/2 h-0.5 pointer-events-none z-0 ${
                                            isDarkMode ? 'bg-zinc-800' : 'bg-zinc-300'
                                        }`}
                                    />
                                )}

                                {/* Right half line connecting to next card */}
                                {!isLatest && (
                                    <div
                                        className={`absolute top-2.5 left-1/2 right-0 h-0.5 pointer-events-none z-0 ${
                                            isDarkMode ? 'bg-zinc-800' : 'bg-zinc-300'
                                        }`}
                                    />
                                )}

                                {/* Timeline Node Dot (Centered horizontally on the continuous line) */}
                                <div
                                    className={`absolute top-0.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-[3px] z-10 transition-colors duration-500 ${
                                        isCurrentActive
                                            ? 'bg-purple-600 border-purple-300 shadow-[0_0_20px_rgba(147,51,234,0.6)]'
                                            : isDarkMode 
                                                ? 'bg-zinc-950 border-zinc-700' 
                                                : 'bg-white border-zinc-300'
                                    }`}
                                />

                                <ScrollReveal delay={idx * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className={`h-full p-7 sm:p-9 rounded-[2rem] flex flex-col justify-between gap-5 relative overflow-hidden group border backdrop-blur-xl transition-[border-color,box-shadow] duration-500 ${
                                            isDarkMode
                                                ? 'bg-zinc-900/40 border-zinc-800/60 hover:border-purple-500/30 hover:bg-zinc-900/60 hover:shadow-[0_12px_36px_rgb(0,0,0,0.5)]'
                                                : 'bg-white/75 border-zinc-200/80 hover:border-purple-700/30 hover:bg-white/90 hover:shadow-[0_12px_36px_rgb(0,0,0,0.06)]'
                                        }`}
                                    >
                                        {/* Inner subtle gradient glow on hover */}
                                        <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10 ${isDarkMode ? 'bg-radial-[at_100%_0%] from-purple-500/10 via-transparent to-transparent' : 'bg-radial-[at_100%_0%] from-purple-700/5 via-transparent to-transparent'}`} />

                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className={`text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                                    {exp.period}
                                                </span>
                                                {isCurrentActive && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/25 text-xs font-semibold tracking-wide text-purple-400">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> Active
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <h3 className={`font-black text-2xl sm:text-3xl tracking-tight leading-snug ${isDarkMode ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'} transition-colors duration-300`}>
                                                    {exp.role}
                                                </h3>
                                                <p className={`text-sm font-bold tracking-wider uppercase ${isDarkMode ? 'text-purple-400/90' : 'text-purple-800/90'}`}>
                                                    {exp.company}
                                                </p>
                                            </div>

                                            <p className={`text-sm font-medium leading-relaxed mt-1 line-clamp-5 ${textMuted}`}>
                                                {exp.description}
                                            </p>
                                        </div>

                                        {exp.linkedProjects && exp.linkedProjects.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800/40 dark:border-zinc-800/40">
                                                {exp.linkedProjects.map((pid: string) => (
                                                    <motion.button
                                                        key={pid}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleProjectClick(pid)}
                                                        className={`text-[10px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                                                            isDarkMode 
                                                                ? 'bg-zinc-800/50 text-zinc-300 hover:bg-purple-500/20 hover:text-purple-300' 
                                                                : 'bg-zinc-100 text-zinc-700 hover:bg-purple-100 hover:text-purple-800'
                                                        }`}
                                                    >
                                                        <FolderGit2 size={12} />
                                                        <span className="truncate max-w-[12rem]">
                                                            {projectLibrary.find(p => p.id === pid)?.name || "Project"}
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </ScrollReveal>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

