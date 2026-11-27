import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    FileDown, 
    Mail, 
    Phone, 
    Check, 
    Copy, 
    MapPin,
    GraduationCap, 
    Sparkles, 
    ArrowUpRight
} from 'lucide-react';

interface RecruiterQuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    myProfile: Record<string, any> | null;
    skills: any[];
    projectLibrary: any[];
    educations: any[];
    onProjectClick?: (projectId: string) => void;
}

export default function RecruiterQuickViewModal({
    isOpen,
    onClose,
    isDarkMode,
    myProfile,
    skills = [],
    projectLibrary = [],
    educations = [],
    onProjectClick
}: RecruiterQuickViewModalProps) {
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Disable body scroll when modal is active
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

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const safeName = (myProfile?.name || "full_name").toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
    const resumeHref = '/resume';
    const email = myProfile?.email || 'contact@example.com';
    const cleanPhone = myProfile?.no_hp ? String(myProfile.no_hp).replace(/[^0-9]/g, '') : '';
    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        }
    };

    // Top 3 featured or recent projects
    const topProjects = projectLibrary.slice(0, 3);
    const topSkills = skills.slice(0, 8);
    const latestEdu = educations[0];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md bg-black/60 cursor-pointer overflow-y-auto"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`w-full max-w-3xl border rounded-3xl sm:rounded-[2rem] p-5 sm:p-6 md:p-7 cursor-default relative overflow-hidden backdrop-blur-2xl shadow-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] flex flex-col ${
                        isDarkMode 
                            ? 'bg-zinc-900/95 border-zinc-800 text-zinc-100' 
                            : 'bg-white/95 border-zinc-200 text-zinc-900'
                    }`}
                >
                    {/* Background glow orb */}
                    <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -z-10 pointer-events-none ${
                        isDarkMode ? 'bg-purple-600/10' : 'bg-purple-700/5'
                    }`} />

                    {/* Modal Header */}
                    <div className={`flex items-start justify-between pb-3.5 sm:pb-4 border-b shrink-0 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase border bg-purple-500/10 border-purple-500/20 text-purple-400">
                                <Sparkles size={12} />
                                Recruiter 60-Second Snapshot
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mt-2">
                                {myProfile?.name || "Developer Profile"}
                            </h2>
                            <p className="text-xs sm:text-sm font-bold text-purple-800 dark:text-purple-400">
                                {myProfile?.job || "Backend Developer & Systems Engineer"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full border transition-all cursor-pointer ${
                                isDarkMode 
                                    ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                                    : 'border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-100'
                            }`}
                            aria-label="Close modal"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Scrollable Content Body */}
                    <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-5 pt-4 pb-1 pr-1">

                        {/* Availability & Location Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border bg-emerald-500/5 border-emerald-500/20 text-xs font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <span className="text-emerald-700 dark:text-emerald-300">
                                    {myProfile?.current_status || myProfile?.availability || "Currently on Contract — Accepting Commissions"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                                <MapPin size={14} />
                                <span>{myProfile?.location || "Remote / Hybrid Ready"}</span>
                            </div>
                        </div>

                        {/* Primary Recruiter Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <a
                                href={resumeHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold tracking-wider uppercase bg-purple-800 hover:bg-purple-700 text-white shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                                title={`Download ${safeName}_cv.pdf`}
                            >
                                <FileDown size={16} />
                                Download Full Resume (PDF)
                            </a>

                            <button
                                onClick={handleCopyEmail}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold tracking-wider uppercase transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                                    isDarkMode 
                                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:bg-zinc-700' 
                                        : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200'
                                }`}
                            >
                                {copiedEmail ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                <span>{copiedEmail ? 'Email Copied!' : 'Copy Direct Email'}</span>
                            </button>
                        </div>

                        {/* Direct Reach Channels */}
                        <div className="flex flex-wrap gap-2 text-xs">
                            <a 
                                href={`mailto:${email}`}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                                    isDarkMode ? 'border-zinc-800 hover:border-purple-500/40 text-zinc-300' : 'border-zinc-200 hover:border-purple-700/40 text-zinc-700'
                                }`}
                            >
                                <Mail size={13} className="text-purple-400" />
                                <span>{email}</span>
                            </a>
                            {cleanPhone && (
                                <a 
                                    href={`https://wa.me/${cleanPhone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                                        isDarkMode ? 'border-zinc-800 hover:border-emerald-500/40 text-zinc-300' : 'border-zinc-200 hover:border-emerald-500/40 text-zinc-700'
                                    }`}
                                >
                                    <Phone size={13} className="text-emerald-400" />
                                    <span>WhatsApp / Phone</span>
                                </a>
                            )}
                        </div>

                        {/* Core Competencies */}
                        {topSkills.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    Primary Tech Stack
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {topSkills.map((s, idx) => (
                                        <span
                                            key={s.id || idx}
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                                                isDarkMode 
                                                    ? 'bg-zinc-950/60 border-zinc-800 text-zinc-300' 
                                                    : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                                            }`}
                                        >
                                            {s.skill_nm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Projects Highlight */}
                        {topProjects.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    Notable Proof-of-Work Projects
                                </h4>
                                <div className="space-y-2.5">
                                    {topProjects.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                if (onProjectClick) {
                                                    onClose();
                                                    onProjectClick(p.id);
                                                }
                                            }}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 group ${
                                                isDarkMode
                                                    ? 'bg-zinc-950/40 border-zinc-800/80 hover:border-purple-500/40 hover:bg-zinc-800/40'
                                                    : 'bg-zinc-50/80 border-zinc-200 hover:border-purple-700/40 hover:bg-zinc-100/80'
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-sm font-bold group-hover:text-purple-400 transition-colors">
                                                        {p.name}
                                                    </h5>
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                                                        isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'
                                                    }`}>
                                                        {p.company}
                                                    </span>
                                                </div>
                                                <p className={`text-xs mt-1 line-clamp-1 ${textMuted}`}>
                                                    {p.details}
                                                </p>
                                            </div>
                                            <span className="text-xs font-semibold text-purple-400 flex items-center gap-1 shrink-0">
                                                Inspect <ArrowUpRight size={13} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Highlight */}
                        {latestEdu && (
                            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs ${isDarkMode ? 'border-zinc-800 bg-zinc-950/30' : 'border-zinc-200 bg-zinc-50/70'}`}>
                                <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-purple-400' : 'bg-zinc-100 border-zinc-200 text-purple-800'}`}>
                                    <GraduationCap size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold">{latestEdu.degree} in {latestEdu.field_of_study}</p>
                                    <p className={textMuted}>{latestEdu.institution} {latestEdu.gpa && `• GPA: ${latestEdu.gpa}`}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
