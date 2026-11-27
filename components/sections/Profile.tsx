import React, { useEffect, useState } from 'react';
import { FolderGit2, MapPin, Mail, Phone, Globe, ArrowUpRight, GraduationCap, FileText, X, ZoomIn } from 'lucide-react';
import { formatDatePeriod } from '@/utils/date';
import { sanitizeHttpUrl } from '@/utils/url';
import ScrollReveal from '../ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

const socialConfigs: Record<string, { label: string; baseUrl: string; path: string }> = {
    github: { label: 'GitHub', baseUrl: 'https://github.com/', path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
    linkedin: { label: 'LinkedIn', baseUrl: 'https://linkedin.com/in/', path: "M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.765s.784-1.765 1.75-1.765 1.75.79 1.75 1.765-.784 1.765-1.75 1.765zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.766c1.397-2.567 5.016-2.74 5.016 1.438v5.796z" }
};

interface ProfileProps {
    isDarkMode: boolean;
    myProfile: any;
    educations: any[];
    projectLibrary: any[];
    handleProjectClick: (projectId: string) => void;
    scrollToTop: () => void;
}

function resolveProfilePicUrl(rawUrl: unknown): string | null {
    if (!rawUrl || typeof rawUrl !== 'string') return null;
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
    return sanitizeHttpUrl(trimmed);
}

export default function Profile({
    isDarkMode,
    myProfile,
    educations,
    projectLibrary,
    handleProjectClick,
}: ProfileProps) {
    const [imgError, setImgError] = useState(false);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);
    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';

    useEffect(() => {
        if (!isPhotoOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsPhotoOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPhotoOpen]);

    const resolveLinkType = (linkStr: any, defaultLabel = 'Website') => {
        if (!linkStr || typeof linkStr !== 'string') return null;
        const cleanStr = linkStr.trim().toLowerCase();

        const match = Object.keys(socialConfigs).find(key => cleanStr.includes(key));
        if (match) {
            const config = socialConfigs[match];
            const rawHref = linkStr.trim().startsWith('http') ? linkStr.trim() : `${config.baseUrl}${linkStr.trim()}`;
            const safeHref = sanitizeHttpUrl(rawHref);
            if (!safeHref) return null;
            return {
                href: safeHref,
                label: config.label,
                icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d={config.path} /></svg>,
                target: "_blank"
            };
        }
        const safeHref = sanitizeHttpUrl(linkStr);
        if (!safeHref) return null;
        return {
            href: safeHref,
            label: defaultLabel,
            icon: <Globe size={17} />,
            target: "_blank"
        };
    };

    const sanitizedEmail = myProfile?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(myProfile.email).trim())
        ? String(myProfile.email).trim()
        : null;

    const cleanPhone = myProfile?.no_hp ? String(myProfile.no_hp).replace(/[^0-9]/g, '') : '';
    const resumeHref = '/resume';
    const profPicUrl = !imgError ? resolveProfilePicUrl(myProfile?.prof_pic) : null;
    const profileDescription = typeof myProfile?.description === 'string' ? myProfile.description.trim() : '';

    const profileLinks = [
        { href: resumeHref, label: 'View Resume (CV)', icon: <FileText size={17} />, target: "_blank" },
        sanitizedEmail && { href: `mailto:${sanitizedEmail}`, label: sanitizedEmail, icon: <Mail size={17} />, target: "_self" },
        cleanPhone && { href: `https://wa.me/${cleanPhone}`, label: myProfile.no_hp, icon: <Phone size={17} />, target: "_blank" },
        ...['link_1', 'link_2', 'link_3', 'social_1', 'social_2', 'social_3']
            .map(key => {
                const val = myProfile?.[key];
                return val ? resolveLinkType(val) : null;
            })
    ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; target: string }[];

    const cardSurface = isDarkMode
        ? 'bg-zinc-900/45 border-zinc-800/70 hover:border-purple-500/30'
        : 'bg-white/80 border-zinc-200/80 hover:border-purple-700/30';

    return (
        <section id="profile" className="w-full sm:min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 relative overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <ScrollReveal className="w-full max-w-6xl mx-auto mb-6 sm:mb-10 md:mb-12 relative z-10">
                <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    About Me
                </h2>
                <div className={`h-1 w-14 sm:w-16 mt-3 sm:mt-4 rounded-full ${isDarkMode ? 'bg-purple-500/60' : 'bg-purple-700/40'}`} />
            </ScrollReveal>

            {/* Bento Grid Container */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">

                {/* IDENTITY & BIO CARD - Span 2 columns */}
                <ScrollReveal delay={0.1} className="lg:col-span-2">
                    <div className={`h-full border rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 flex flex-col justify-between gap-4 sm:gap-6 backdrop-blur-xl relative overflow-hidden transition-[border-color,box-shadow] duration-500 hover:shadow-2xl ${cardSurface}`}>
                        <div className={`absolute inset-0 rounded-3xl sm:rounded-[2rem] opacity-60 pointer-events-none -z-10 ${isDarkMode ? 'bg-radial-[at_0%_0%] from-purple-500/10 via-transparent to-transparent' : 'bg-radial-[at_0%_0%] from-purple-700/5 via-transparent to-transparent'}`} />

                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-7">
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative shrink-0"
                            >
                                <div className={`p-[2px] rounded-2xl sm:rounded-3xl bg-gradient-to-br ${isDarkMode ? 'from-purple-500/40 via-zinc-700/40 to-zinc-800/40' : 'from-purple-500/30 via-zinc-200 to-zinc-300/60'} shadow-xl`}>
                                    {profPicUrl ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsPhotoOpen(true)}
                                            aria-label="View profile picture"
                                            className={`group relative w-20 h-20 sm:w-32 sm:h-32 rounded-[0.9rem] sm:rounded-[1.35rem] overflow-hidden flex items-center justify-center cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}
                                        >
                                            <img
                                                src={profPicUrl}
                                                alt={myProfile?.name || "Profile picture"}
                                                onError={() => setImgError(true)}
                                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                                                <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                                            </span>
                                        </button>
                                    ) : (
                                        <div className={`w-20 h-20 sm:w-32 sm:h-32 rounded-[0.9rem] sm:rounded-[1.35rem] overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                                            <span className={`text-3xl sm:text-4xl md:text-5xl font-black ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                                {(myProfile?.name || "A").charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            <div className="text-center sm:text-left space-y-1.5 sm:space-y-2.5 min-w-0 flex-1">
                                <div>
                                    <h3 className={`text-2xl sm:text-4xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
                                        {myProfile?.name || "Anonymous Developer"}
                                    </h3>
                                    <p className={`font-semibold text-sm sm:text-lg mt-0.5 sm:mt-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                                        {myProfile?.job || "Software Engineer"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${isDarkMode ? 'text-zinc-300 bg-zinc-900/80 border-zinc-700/60' : 'text-zinc-700 bg-zinc-50 border-zinc-200'}`}>
                                        <MapPin size={13} className={`shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`} />
                                        <span className="truncate">{myProfile?.location || "Remote"}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {profileDescription && (
                            <div className={`pt-4 sm:pt-5 border-t ${isDarkMode ? 'border-zinc-800/70' : 'border-zinc-200/80'}`}>
                                <p className={`text-xs sm:text-[15px] leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                    {profileDescription}
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                {/* CONNECT / SOCIAL CARD - Span 1 column */}
                <ScrollReveal delay={0.2} className="lg:col-span-1">
                    <div className={`h-full border rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 flex flex-col gap-3 sm:gap-4 backdrop-blur-xl relative overflow-hidden transition-[border-color,box-shadow] duration-500 hover:shadow-2xl ${cardSurface}`}>
                        <div className={`absolute inset-0 rounded-3xl sm:rounded-[2rem] opacity-60 pointer-events-none -z-10 ${isDarkMode ? 'bg-radial-[at_100%_0%] from-purple-500/10 via-transparent to-transparent' : 'bg-radial-[at_100%_0%] from-purple-700/5 via-transparent to-transparent'}`} />

                        <h4 className={`text-xs font-bold uppercase tracking-[0.18em] font-sans ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            Connect
                        </h4>

                        <div className="flex flex-col gap-2 sm:gap-2.5 flex-1 justify-center">
                            {profileLinks.map((link, idx) => (
                                <motion.a
                                    key={idx}
                                    href={link.href}
                                    target={link.target || "_blank"}
                                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`flex items-center gap-3 p-2 sm:p-2.5 pr-3 sm:pr-3.5 rounded-xl sm:rounded-2xl border transition-colors duration-200 group ${isDarkMode
                                        ? 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-800/80 hover:border-purple-500/40 text-zinc-300 hover:text-purple-300'
                                        : 'bg-white border-zinc-200/90 hover:bg-zinc-50 hover:border-purple-700/40 text-zinc-700 hover:text-purple-800'
                                        }`}
                                >
                                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors ${isDarkMode ? 'bg-zinc-800/80 text-zinc-300 group-hover:text-purple-300' : 'bg-zinc-100 text-zinc-600 group-hover:text-purple-800'}`}>
                                        {link.icon}
                                    </span>
                                    <span className="text-xs sm:text-sm font-semibold truncate flex-1">{link.label}</span>
                                    <ArrowUpRight size={15} className="shrink-0 opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* EDUCATION CARD - Span 3 columns */}
                <ScrollReveal delay={0.3} className="lg:col-span-3">
                    <div className={`border rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 md:p-9 flex flex-col gap-4 sm:gap-6 backdrop-blur-xl relative overflow-hidden transition-[border-color,box-shadow] duration-500 hover:shadow-2xl ${cardSurface}`}>
                        <div className={`absolute inset-0 rounded-3xl sm:rounded-[2rem] opacity-60 pointer-events-none -z-10 ${isDarkMode ? 'bg-radial-[at_50%_100%] from-purple-500/10 via-transparent to-transparent' : 'bg-radial-[at_50%_100%] from-purple-700/5 via-transparent to-transparent'}`} />

                        <div className="flex items-center gap-3">
                            <div className={`p-2 sm:p-2.5 rounded-xl border ${isDarkMode ? 'bg-zinc-800/60 border-zinc-700/70' : 'bg-zinc-100 border-zinc-200'}`}>
                                <GraduationCap size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-800'} />
                            </div>
                            <h4 className={`text-lg sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                                Education &amp; Academics
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {educations.length > 0 ? (
                                educations.map((edu) => (
                                    <motion.div
                                        key={edu.id}
                                        whileHover={{ y: -3 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                        className={`p-4 sm:p-6 border rounded-2xl sm:rounded-3xl flex flex-col justify-between gap-3 sm:gap-4 relative overflow-hidden group ${isDarkMode
                                            ? 'bg-zinc-900/75 border-zinc-800/80 hover:border-purple-500/40 hover:shadow-[0_4px_20px_rgb(0,0,0,0.3)]'
                                            : 'bg-white border-zinc-200/80 hover:border-purple-700/30 hover:shadow-lg'
                                            }`}
                                    >
                                        <div className="space-y-2 sm:space-y-2.5">
                                            <div className="flex items-start justify-between gap-2 font-mono">
                                                <span className={`text-[10px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-full truncate ${isDarkMode ? 'text-purple-300 bg-purple-500/10 border-purple-500/20' : 'text-purple-900 bg-purple-50 border-purple-200'}`}>
                                                    {formatDatePeriod(edu.start_date)} — {formatDatePeriod(edu.end_date)}
                                                </span>
                                                {edu.gpa && <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>GPA: {edu.gpa}</span>}
                                            </div>

                                            <div>
                                                <h5 className={`text-base sm:text-xl font-black tracking-tight leading-snug ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>
                                                    {edu.degree} in {edu.field_of_study}
                                                </h5>
                                                <p className={`text-xs sm:text-sm font-bold mt-1 uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                                    {edu.institution}
                                                </p>
                                            </div>
                                        </div>

                                        {edu.education_desc && (
                                            <p className={`text-sm font-medium leading-relaxed border-t pt-3.5 ${isDarkMode ? 'border-zinc-800/60 text-zinc-400' : 'border-zinc-200/70 text-zinc-600'}`}>
                                                {edu.education_desc}
                                            </p>
                                        )}

                                        {edu.linkedProjects && edu.linkedProjects.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {edu.linkedProjects.map((pid: string) => (
                                                    <motion.button
                                                        key={pid}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProjectClick(pid);
                                                        }}
                                                        className={`text-[10px] font-bold uppercase tracking-wider border px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors ${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-purple-500/20 hover:text-purple-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-purple-100 hover:text-purple-800'}`}
                                                    >
                                                        <FolderGit2 size={12} />
                                                        <span className="truncate max-w-[12rem]">{projectLibrary.find(p => p.id === pid)?.name || "Project"}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className={`col-span-full p-8 border border-dashed rounded-3xl text-sm font-sans text-center ${textMuted}`}>
                                    No academic records found.
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* Profile Picture Lightbox Modal */}
            <AnimatePresence>
                {isPhotoOpen && profPicUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsPhotoOpen(false)}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.94, opacity: 0, y: 8 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.94, opacity: 0, y: 8 }}
                            transition={{ type: "spring", stiffness: 320, damping: 26 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-fit max-w-[90vw] flex flex-col gap-3 cursor-default"
                        >
                            <div className="flex items-center justify-between gap-4 px-1">
                                <span className="text-sm font-semibold text-zinc-200 truncate">
                                    {myProfile?.name || "Profile Picture"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsPhotoOpen(false)}
                                    aria-label="Close profile picture"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-white backdrop-blur-md transition-colors cursor-pointer shrink-0"
                                >
                                    <X size={14} />
                                    <span>Close</span>
                                </button>
                            </div>
                            <img
                                src={profPicUrl}
                                alt={myProfile?.name || "Profile picture"}
                                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl border border-white/10 shadow-2xl bg-zinc-950"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
