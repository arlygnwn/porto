import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Building2, GraduationCap, Briefcase, ExternalLink, ArrowUpRight, BarChart3, Code2 } from 'lucide-react';
import { sanitizeHttpUrl } from '@/utils/url';

interface ProjectDetailModalProps {
    isOpen: boolean;
    project: any | null;
    onClose: () => void;
    isDarkMode: boolean;
}

export default function ProjectDetailModal({
    isOpen,
    project,
    onClose,
    isDarkMode
}: ProjectDetailModalProps) {
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

    if (!project) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
    const cardBg = isDarkMode 
        ? 'bg-zinc-900/90 border-zinc-800/80 hover:border-purple-500/20' 
        : 'bg-white/95 border-zinc-200 shadow-xl';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 cursor-pointer overflow-y-auto"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`w-full max-w-2xl border rounded-[2rem] p-6 md:p-8 cursor-default relative overflow-hidden backdrop-blur-2xl ${cardBg}`}
                    >
                        {/* Background subtle glow */}
                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10 pointer-events-none ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-700/5'}`} />

                        {/* Header controls */}
                        <div className="flex justify-between items-start gap-4">
                            <span className={`text-[10px] font-bold tracking-widest uppercase border px-3 py-1 rounded-full ${isDarkMode ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-800 bg-purple-50 border-purple-200'}`}>
                                {project.company}
                            </span>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full border transition-all cursor-pointer ${isDarkMode ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50' : 'border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}
                                aria-label="Close modal"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Project Info */}
                        <div className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <h3 className={`text-3xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    {project.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold">
                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                        <Calendar size={13} />
                                        <span>{project.period}</span>
                                    </div>
                                    {project.experience_id ? (
                                        <div className="flex items-center gap-1.5 text-purple-400">
                                            <Briefcase size={13} />
                                            <span>Professional Project</span>
                                        </div>
                                    ) : project.education_id ? (
                                        <div className="flex items-center gap-1.5 text-emerald-400">
                                            <GraduationCap size={13} />
                                            <span>Academic Project</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-zinc-500">
                                            <Building2 size={13} />
                                            <span>Standalone</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className={`h-px w-full ${isDarkMode ? 'bg-zinc-800/50' : 'bg-zinc-200/60'}`} />

                            {/* Details text */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    Description & Details
                                </h4>
                                <p className={`text-sm sm:text-base font-medium leading-relaxed whitespace-pre-wrap ${textMuted}`}>
                                    {project.details}
                                </p>
                            </div>

                            {/* Quantifiable Impact & Metrics (Recruiter Focus) */}
                            {project.metrics && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 size={15} className="text-purple-700 dark:text-purple-400" />
                                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                            Quantifiable Impact & Results
                                        </h4>
                                    </div>
                                    <div className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed ${
                                        isDarkMode 
                                            ? 'bg-purple-950/25 border-purple-900/40 text-zinc-200' 
                                            : 'bg-purple-50/60 border-purple-200/80 text-zinc-800'
                                    }`}>
                                        {project.metrics}
                                    </div>
                                </div>
                            )}

                            {/* Verification Links (GitHub / Live Demo) */}
                            {(project.repo_url || project.demo_url) && (
                                <div className="space-y-3">
                                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        Verification & Demo
                                    </h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {project.repo_url && sanitizeHttpUrl(project.repo_url) && (
                                            <a
                                                href={sanitizeHttpUrl(project.repo_url)!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                                                    isDarkMode
                                                        ? 'bg-zinc-950/60 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white'
                                                        : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-black'
                                                }`}
                                            >
                                                <Code2 size={14} className="text-purple-400" />
                                                <span>Source Code</span>
                                                <ArrowUpRight size={13} className="opacity-70" />
                                            </a>
                                        )}
                                        {project.demo_url && sanitizeHttpUrl(project.demo_url) && (
                                            <a
                                                href={sanitizeHttpUrl(project.demo_url)!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-purple-800 hover:bg-purple-700 text-white transition-colors shadow-sm"
                                            >
                                                <ExternalLink size={14} />
                                                <span>Live Demo / API</span>
                                                <ArrowUpRight size={13} className="opacity-70" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tech Stack */}
                            <div className="space-y-3">
                                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech && project.tech.map((t: string) => (
                                        <span
                                            key={t}
                                            className={`px-3 py-1.5 font-sans text-xs font-semibold rounded-xl border ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions / References */}
                            {(project.experience_id || project.education_id) && (
                                <div className="pt-2">
                                    <button
                                        onClick={() => {
                                            onClose();
                                            const targetId = project.experience_id ? 'experience' : 'profile';
                                            const element = document.getElementById(targetId);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }}
                                        className={`w-full py-3.5 px-4 rounded-2xl border text-xs font-bold tracking-wider uppercase text-center cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${
                                            isDarkMode 
                                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' 
                                            : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100/70 shadow-sm'
                                        }`}
                                    >
                                        {project.experience_id ? 'View Career Journey' : 'View Academic Profile'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
