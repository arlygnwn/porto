"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, FolderGit2, User, Globe, Sun, Moon, Search, X, Terminal, CheckCircle2, ArrowUpRight, MapPin, Mail, Phone } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// --- STATIC INVARIANT STORAGE ---
const navigationLinks = [
    { label: "Home", id: "home", icon: <Home size={13} /> },
    { label: "Experience", id: "experience", icon: <Briefcase size={13} /> },
    { label: "Projects", id: "project", icon: <FolderGit2 size={13} /> },
    { label: "Profile", id: "profile", icon: <User size={13} /> },
];

const socialConfigs: Record<string, { label: string; baseUrl: string; path: string }> = {
    github: { label: 'GitHub', baseUrl: 'https://github.com/', path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
    linkedin: { label: 'LinkedIn', baseUrl: 'https://linkedin.com/in/', path: "M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.765s.784-1.765 1.75-1.765 1.75.79 1.75 1.765-.784 1.765-1.75 1.765zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.766c1.397-2.567 5.016-2.74 5.016 1.438v5.796z" }
};

export default function PortfolioLanding() {
    const [myProfile, setMyProfile] = useState<Record<string, any> | null>(null);
    const [experiences, setExperiences] = useState<any[]>([]);
    const [educations, setEducations] = useState<any[]>([]);
    const [projectLibrary, setProjectLibrary] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isDatabaseOnline, setIsDatabaseOnline] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeExpIndex, setActiveExpIndex] = useState(0);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasInitializedScroll = useRef(false);

    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
    const borderMuted = isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200/60';

    const formatDatePeriod = (dateStr: string | null): string => {
        if (!dateStr) return 'Present';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Present';
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const setScrollContainerRef = (node: HTMLDivElement | null) => {
        if (node && experiences.length > 0) {
            scrollContainerRef.current = node;
            if (!hasInitializedScroll.current) {
                const activeDutyIndex = experiences.length - 1;
                node.scrollLeft = activeDutyIndex * 380;
                hasInitializedScroll.current = true;
            }
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        scrollTimeoutRef.current = setTimeout(() => {
            const cardWidthWithGap = 380;
            const index = Math.round(container.scrollLeft / cardWidthWithGap);
            if (index >= 0 && index < experiences.length && index !== activeExpIndex) {
                setActiveExpIndex(index);
            }
        }, 50);
    };

    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    const handleProjectClick = (projectId: string) => {
        setSearchQuery("");
        setTimeout(() => {
            document.getElementById(`card-${projectId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const resolveLinkType = (linkStr: any, defaultLabel = 'Website') => {
        if (!linkStr || typeof linkStr !== 'string') return null;

        const cleanStr = linkStr.toLowerCase();
        const colorClass = `transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-600'}`;

        const match = Object.keys(socialConfigs).find(key => cleanStr.includes(key));
        if (match) {
            const config = socialConfigs[match];
            return {
                href: linkStr.startsWith('http') ? linkStr : `${config.baseUrl}${linkStr}`,
                label: config.label,
                icon: <svg viewBox="0 0 24 24" className={`w-4 h-4 ${colorClass}`} fill="currentColor"><path d={config.path} /></svg>,
                target: "_blank"
            };
        }
        return {
            href: linkStr.startsWith('http') ? linkStr : `https://${linkStr}`,
            label: defaultLabel,
            icon: <Globe size={16} className={colorClass} />,
            target: "_blank"
        };
    };

    useEffect(() => {
        const supabase = createClient();
        async function initializeAndFetch() {
            try {
                const targetUuid = process.env.NEXT_PUBLIC_USER_UUID;
                if (!targetUuid) return;

                // 1. Fetch Lookups Concurrently
                const [
                    { data: profileData, error: profileErr },
                    { data: eduData },
                    { data: expData },
                    { data: rawProjData },
                    { data: skillsData },
                    { data: pSkillsData }
                ] = await Promise.all([
                    supabase.from('profiles').select('*').eq('id', targetUuid).single(),
                    supabase.from('educations').select('*').eq('profile_id', targetUuid).order('start_date', { ascending: false }),
                    supabase.from('experiences').select('*').eq('profile_id', targetUuid).order('start_date', { ascending: true }),
                    supabase.from('projects').select('*'),
                    supabase.from('skills').select('*'),
                    supabase.from('project_skills').select('*')
                ]);

                if (profileErr || !profileData) throw profileErr;
                setMyProfile(profileData);
                setIsDatabaseOnline(true);

                if (eduData) setEducations(eduData);

                // 2. Process Projects with Relational Table Fallbacks
                let processedProjects: any[] = [];
                if (rawProjData) {
                    processedProjects = rawProjData.map((proj) => {
                        let companyName = "Independent Project";
                        let computedPeriod = formatDatePeriod(proj.standalone_date);

                        // If linked to an experience context
                        if (proj.experience_id && expData) {
                            const linkedExp = expData.find(e => e.id === proj.experience_id);
                            if (linkedExp) {
                                companyName = linkedExp.company_nm;
                                computedPeriod = `${formatDatePeriod(linkedExp.start_date)} — ${formatDatePeriod(linkedExp.end_date)}`;
                            }
                        }
                        // Fallback link to an educational institution context
                        else if (proj.education_id && eduData) {
                            const linkedEdu = eduData.find(e => e.id === proj.education_id);
                            if (linkedEdu) {
                                companyName = linkedEdu.institution;
                                computedPeriod = `${formatDatePeriod(linkedEdu.start_date)} — ${formatDatePeriod(linkedEdu.end_date)}`;
                            }
                        }

                        // Map joined skills via project_skills intersection table
                        const linkedSkills = pSkillsData && skillsData
                            ? pSkillsData
                                .filter((ps) => ps.project_id === proj.id)
                                .map((ps) => skillsData.find((s) => s.id === ps.skill_id)?.skill_nm)
                                .filter(Boolean)
                            : [];

                        // Safe fallback structural breakdown for metrics/bullet details
                        const detailedMetrics = proj.project_desc
                            ? proj.project_desc.split('\n').filter((str: string) => str.trim().length > 0)
                            : ["No Description"];

                        return {
                            id: proj.id,
                            name: proj.project_nm || "No Project",
                            company: companyName,
                            period: computedPeriod,
                            details: detailedMetrics[0] || "", // First line behaves as short abstract
                            metrics: detailedMetrics.slice(1).length > 0 ? detailedMetrics.slice(1) : detailedMetrics, // Sub-lines as bullet impacts
                            tech: linkedSkills.length > 0 ? linkedSkills : ["System Module"],
                            experience_id: proj.experience_id
                        };
                    });

                    setProjectLibrary(processedProjects);
                }

                // 3. Process Experiences
                if (expData) {
                    const parsedExperiences = expData.map(exp => ({
                        period: `${formatDatePeriod(exp.start_date)} — ${formatDatePeriod(exp.end_date)}`,
                        role: exp.job_nm,
                        company: exp.company_nm,
                        description: exp.job_desc,
                        linkedProjects: processedProjects
                            .filter(p => p.experience_id === exp.id)
                            .map(p => p.id)
                    }));
                    setExperiences(parsedExperiences);
                    setActiveExpIndex(parsedExperiences.length - 1);
                }

            } catch (err) {
                console.error("System Relational Assembly Fault:", err);
            } finally {
                setIsLoading(false);
            }
        }
        initializeAndFetch();
    }, []);

    const filteredProjects = projectLibrary.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (isLoading) return;
        const sections = document.querySelectorAll("section[id]");

        const observer = new IntersectionObserver((entries) => {
            const visible = entries.find(e => e.isIntersecting);
            if (visible) {
                const targetId = visible.target.id;
                setActiveSection(targetId);
                window.history.replaceState(null, "", `#${targetId}`);
            }
        }, { rootMargin: "-45% 0px -45% 0px" });

        sections.forEach(s => observer.observe(s));
        return () => sections.forEach(s => observer.unobserve(s));
    }, [isLoading]);

    const cleanPhone = myProfile?.no_hp ? myProfile.no_hp.replace(/[^0-9]/g, '') : '';
    const profileLinks = [
        myProfile?.email && { href: `mailto:${myProfile.email}`, label: myProfile.email, icon: <Mail size={15} />, target: "_self" },
        myProfile?.no_hp && { href: `https://wa.me/${cleanPhone}`, label: myProfile.no_hp, icon: <Phone size={15} />, target: "_blank" },
        myProfile?.link_1 && resolveLinkType(myProfile.link_1),
        myProfile?.link_2 && resolveLinkType(myProfile.link_2),
        myProfile?.link_3 && resolveLinkType(myProfile.link_3),
        myProfile?.social_1 && resolveLinkType(myProfile.social_1),
        myProfile?.social_2 && resolveLinkType(myProfile.social_2),
        myProfile?.social_3 && resolveLinkType(myProfile.social_3)
    ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; target: string }[];

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-zinc-950 text-zinc-500' : 'bg-zinc-50 text-zinc-400'} font-mono text-xs tracking-widest animate-pulse`}>
                Getting Started ...
            </div>
        );
    }

    return (
        <div className={`relative h-screen overflow-y-auto overflow-x-hidden font-sans antialiased snap-y snap-mandatory scroll-smooth transition-colors duration-1000 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-linear-to-br from-orange-50 via-sky-50 to-blue-100 text-zinc-900'}`}>

            {/* ATMOSPHERIC LAYER */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
                {isDarkMode ? (
                    <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                ) : (
                    <div className="absolute inset-0 transform-gpu opacity-60">
                        <div className="absolute -top-1/10 -left-1/10 w-150 h-100 bg-linear-to-br from-white/40 to-transparent rounded-full blur-[120px]" />
                    </div>
                )}
            </div>

            {/* BAR MENU STICKY NAVIGATION */}
            <nav className={`backdrop-blur-md border-b fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950/80 border-zinc-900/50' : 'bg-white/70 border-white/40'}`}>
                <div className="w-full px-4 h-16 grid grid-cols-3 items-center">
                    <a href="/#home" className="text-sm font-bold bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Arly.dev</a>
                    <div className="flex justify-center gap-1">
                        {navigationLinks.map((link) => (
                            <a
                                key={link.id} href={`#${link.id}`}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeSection === link.id ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : isDarkMode ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-800"}`}
                            >
                                {activeSection === link.id && (
                                    <motion.span layoutId="navIndicator" className={`absolute inset-0 border rounded-lg -z-10 ${isDarkMode ? 'bg-zinc-900 border-zinc-800/60' : 'bg-zinc-100 border-zinc-200/50'}`} />
                                )}
                                {link.icon} <span className="hidden sm:inline">{link.label}</span>
                            </a>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
                            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* 1. HOME HERO */}
            <section id="home" className="w-full h-screen flex flex-col justify-center items-center snap-start px-4 relative">
                <div className={`absolute top-24 right-4 inline-flex items-center gap-2 border px-3 py-1 rounded-full text-[10px] font-mono tracking-widest ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400' : 'bg-zinc-100/80 border-zinc-200 text-zinc-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isDatabaseOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                    STATUS: {isDatabaseOnline ? 'ONLINE' : 'FAULT'}
                </div>
                <div className="space-y-6 max-w-6xl text-center z-10">
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                        Reliable backend <br /><span className={isDarkMode ? 'text-zinc-600' : 'text-zinc-300'}>infrastructure.</span>
                    </h1>
                    <p className={`text-lg sm:text-xl font-light ${textMuted}`}>
                        A Backend Developer specialized in clean, maintainable server-side solutions, with cross-functional competencies in DevOps, networking, and hardware systems.
                    </p>
                    <a href="/#experience" className={`text-xs font-bold px-6 py-3 rounded-full inline-block shadow-lg ${isDarkMode ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 text-white'}`}>
                        Explore Experience
                    </a>
                </div>
            </section>

            {/* 2. EXPERIENCE TIMELINE */}
            <section id="experience" className={`w-full h-screen flex flex-col justify-center snap-start px-4 border-t ${borderMuted}`}>
                <div className="w-full max-w-6xl mx-auto mb-12 flex items-end justify-between">
                    <div>
                        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Professional Journey</h2>
                    </div>
                </div>

                <div className="relative w-full max-w-6xl mx-auto flex items-center h-95">
                    <div
                        ref={setScrollContainerRef}
                        onScroll={handleScroll}
                        className="w-full flex items-center gap-10 overflow-x-auto snap-x snap-mandatory scroll-smooth h-full py-6 z-10 hide-scrollbar"
                        style={{
                            scrollbarWidth: 'none',
                            paddingLeft: 'calc(50% - 170px)',
                            paddingRight: 'calc(50% - 170px)'
                        }}
                    >
                        {experiences.map((exp, idx) => {
                            const isFocused = activeExpIndex === idx;
                            const isCurrent = idx === experiences.length - 1;
                            return (
                                <div id={`exp-card-${idx}`} key={idx} className="snap-center shrink-0 h-full flex items-center">
                                    {/* CHANGED: Converted container to motion.div with hover animations matching your project cards */}
                                    <motion.div
                                        layout
                                        whileHover={isFocused ? { y: -6 } : {}}
                                        transition={{ type: "spring", stiffness: 320, damping: 24 }}
                                        className={`min-w-85 max-w-85 h-75 border p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 shadow-2xl relative z-10 ${
                                            isFocused
                                                ? (isDarkMode ? 'bg-zinc-900 border-zinc-700/80 shadow-indigo-500/10' : 'bg-white border-zinc-100 shadow-indigo-500/5') + ' scale-105 -translate-y-2'
                                                : (isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200/60') + ' opacity-45'
                                        }`}
                                    >

                                        <div className="flex items-center justify-between relative z-20">
                                            <div className={`w-4 h-4 rounded-full border-2 ${isCurrent ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]' : isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-300'}`} />
                                            {isCurrent && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-mono text-indigo-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> ACTIVE_DUTY
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1 mt-2 flex-1 pt-2">
                                            <span className="text-[10px] font-mono uppercase tracking-widest block text-zinc-500">{exp.period}</span>
                                            <h3 className="font-black text-xl tracking-tight">{exp.role}</h3>
                                            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{exp.company}</p>
                                            <p className={`text-xs font-light line-clamp-3 mt-1 ${textMuted}`}>{exp.description}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed border-zinc-800/40">
                                            {exp.linkedProjects && exp.linkedProjects.length > 0 ? (
                                                exp.linkedProjects.map((pid: string) => (
                                                    <button
                                                        key={pid}
                                                        onClick={() => handleProjectClick(pid)}
                                                        className={`text-[9px] border px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40' : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-indigo-600 hover:border-indigo-600/30'}`}
                                                    >
                                                        <FolderGit2 size={9} />
                                                        <span className="truncate max-w-37.5">{projectLibrary.find(p => p.id === pid)?.name || "Project Node"}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">No Linked Repositories</span>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. PROJECT LIBRARY */}
            <section id="project" className={`w-full min-h-screen h-auto flex flex-col justify-center snap-start px-4 sm:px-6 lg:px-8 py-20 border-t ${borderMuted}`}>
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full max-w-6xl mx-auto">
                    <div>
                        <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Project Library</h2>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`} />
                        <input
                            type="text" placeholder="Search ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-8 py-2 border rounded-xl font-mono text-xs transition-all tracking-wider focus:outline-none focus:ring-1 ${isDarkMode ? 'bg-zinc-950/60 border-zinc-900 text-zinc-200 placeholder-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/30' : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-indigo-600 focus:ring-indigo-600/20'}`}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'}`}>
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative min-h-75 w-full max-w-6xl mx-auto flex justify-center items-center">
                    <motion.div layout className="flex flex-wrap justify-center gap-6 w-full mx-auto">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id} id={`card-${project.id}`} layout
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: -10 }} whileHover={{ y: -6 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 24, opacity: { duration: 0.25 } }}
                                    className={`border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm transition-colors shadow-md group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md ${isDarkMode ? 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800' : 'bg-zinc-50/50 border-zinc-200 hover:border-zinc-300'}`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-2 font-mono">
                                <span className={`text-[9px] font-bold tracking-widest uppercase border px-2 py-0.5 rounded truncate max-w-[65%] ${isDarkMode ? 'text-indigo-400 bg-indigo-950/40 border-indigo-900/20' : 'text-indigo-600 bg-indigo-50 border-indigo-100'}`}>
                                    {project.company}
                                </span>
                                            <span className={`text-[10px] shrink-0 ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>{project.period}</span>
                                        </div>

                                        <h3 className={`text-xl font-bold tracking-tight leading-snug ${isDarkMode ? 'text-zinc-50 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'}`}>{project.name}</h3>
                                        <p className={`text-xs font-light leading-relaxed line-clamp-3 ${textMuted}`}>{project.details}</p>
                                    </div>

                                    <div className="pt-5 mt-4 border-t flex flex-col gap-3 justify-end border-dashed border-zinc-800/40">
                                        <div className="flex flex-wrap gap-1">
                                            {project.tech && project.tech.map((t: string) => (
                                                <span key={t} className={`border px-2 py-0.5 font-mono text-[9px] rounded ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-500'}`}>{t}</span>
                                            ))}
                                        </div>

                                        {/* CONNECTOR HUB: Navigates back up to specific Context Sources */}
                                        <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                                <span className={isDarkMode ? 'text-zinc-700' : 'text-zinc-400'}>
                                    0x{project.id ? project.id.substring(0, 5).toUpperCase() : 'NODE'}
                                </span>

                                            {project.experience_id ? (
                                                <button
                                                    onClick={() => {
                                                        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className={`font-bold uppercase flex items-center gap-0.5 transition-colors cursor-pointer ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                                                >
                                                    View Journey <ArrowUpRight size={11} />
                                                </button>
                                            ) : project.education_id ? (
                                                <button
                                                    onClick={() => {
                                                        document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className={`font-bold uppercase flex items-center gap-0.5 transition-colors cursor-pointer ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
                                                >
                                                    View Academy <ArrowUpRight size={11} />
                                                </button>
                                            ) : (
                                                <span className={`text-[9px] uppercase tracking-wider font-semibold ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                        Standalone
                                    </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProjects.length === 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`border border-dashed rounded-2xl p-12 text-center font-mono text-xs tracking-wider space-y-3 w-full max-w-2xl absolute ${isDarkMode ? 'bg-zinc-900/10 border-zinc-900 text-zinc-600' : 'bg-zinc-50/50 border-zinc-200 text-zinc-400'}`}>
                            <div>ERR_NO_MATCHING_NODES_FOUND_FOR: "{searchQuery}"</div>
                            <button onClick={() => setSearchQuery("")} className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-indigo-400 hover:bg-zinc-800 hover:text-indigo-300' : 'bg-white border-zinc-200 text-indigo-600 hover:bg-zinc-50 hover:text-indigo-700'}`}>
                                Reset Active Query
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* 4. PROFILE */}
            <section id="profile" className={`w-full min-h-screen h-auto flex flex-col justify-center snap-start px-4 sm:px-6 lg:px-8 py-20 border-t ${borderMuted}`}>
                <div className="w-full max-w-6xl mx-auto mb-12 flex items-end justify-between">
                    <div>
                        <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>About Me</h2>
                    </div>
                </div>

                <div
                    className={`border p-6 sm:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 shadow-2xl relative w-full max-w-6xl mx-auto ${isDarkMode ? 'bg-linear-to-b from-zinc-900/30 to-zinc-950 border-zinc-900' : 'bg-linear-to-b from-zinc-50 to-white border-zinc-200'}`}
                >
                    {/* LEFT SIDE: DYNAMIC EDUCATION MAP (CHANGED: Loops over educations table fields) */}
                    <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 justify-center">
                        <h4 className={`text-xs font-bold uppercase tracking-widest font-mono ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            Education
                        </h4>
                        <div className="flex flex-col gap-4 max-h-112.5 overflow-y-auto pr-1">
                            {educations.length > 0 ? (
                                educations.map((edu) => (
                                    <div
                                        key={edu.id}
                                        className={`p-5 border rounded-2xl flex flex-col justify-between gap-3 ${isDarkMode ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-zinc-50/50 border-zinc-200/60'}`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                                                <span>{formatDatePeriod(edu.start_date)} — {formatDatePeriod(edu.end_date)}</span>
                                                {edu.gpa && <span className={isDarkMode ? 'text-indigo-400 font-bold' : 'text-indigo-600 font-bold'}>GPA: {edu.gpa}</span>}
                                            </div>
                                            <h5 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                                                {edu.degree} in {edu.field_of_study}
                                            </h5>
                                            <p className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                                {edu.institution}
                                            </p>
                                        </div>
                                        {edu.education_desc && (
                                            <p className={`text-xs font-light leading-relaxed border-t pt-2 border-dashed ${isDarkMode ? 'border-zinc-900 text-zinc-400' : 'border-zinc-200 text-zinc-600'}`}>
                                                {edu.education_desc}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className={`p-5 border border-dashed rounded-2xl text-xs font-mono text-center ${textMuted}`}>
                                    NO_ACADEMIC_RECORDS_FOUND
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MIDDLE DIVIDER */}
                    <div className={`hidden lg:block w-px h-full bg-linear-to-b ${isDarkMode ? 'from-zinc-900/20 via-zinc-900 to-zinc-900/20' : 'from-zinc-100/20 via-zinc-200 to-zinc-100/20'}`} />

                    {/* RIGHT SIDE: CORE IDENTITY CARD */}
                    <div className="col-span-1 lg:col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 items-center my-auto w-full">
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                            <div className="relative shrink-0">
                                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border flex items-center justify-center text-4xl font-bold ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>
                                    {(myProfile?.full_name || myProfile?.name || "A").charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="text-center sm:text-left space-y-2 min-w-0 flex-1">
                                <div>
                                    <h3 className={`text-3xl font-bold tracking-tight truncate ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
                                        {myProfile?.full_name || myProfile?.name || "Anonymous Developer"}
                                    </h3>
                                    <p className={`font-medium text-sm mt-0.5 truncate ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                        {myProfile?.job || "Software Engineer"}
                                    </p>
                                </div>
                                <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-xl border shadow-inner max-w-full ${isDarkMode ? 'text-zinc-400 bg-zinc-900/60 border-zinc-800' : 'text-zinc-600 bg-zinc-100 border-zinc-200'}`}>
                                    <MapPin size={12} className={`shrink-0 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                                    <span className="truncate">{myProfile?.location || "Remote Node"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Social Link Blocks */}
                        <div className="flex flex-col gap-2.5 w-full relative z-30">
                            {profileLinks.map((link, idx) => (
                                <div
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (link.href) {
                                            window.open(link.href, link.target || "_blank", "noopener,noreferrer");
                                        }
                                    }}
                                    className={`flex items-center justify-between p-3 border rounded-xl transition-all group cursor-pointer w-full relative z-40 ${isDarkMode ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1 select-none pointer-events-none">
                                        <span className={`shrink-0 transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-600'}`}>{link.icon}</span>
                                        <span className={`text-xs truncate transition-colors ${isDarkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>{link.label}</span>
                                    </div>
                                    <ArrowUpRight size={13} className={`shrink-0 opacity-40 group-hover:opacity-100 transition-all pointer-events-none ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}