"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mail, Phone, MapPin, Home, Briefcase, User, FolderGit2, ChevronLeft, ChevronRight, Terminal, Sparkles, CheckCircle2, Sun, Moon, Search, X, Globe } from "lucide-react";

export default function PortfolioLanding() {
    const [myProfile, setMyProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDatabaseOnline, setIsDatabaseOnline] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeExpIndex, setActiveExpIndex] = useState(2);

    const profileCardRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-150, 150], [6, -6]);
    const rotateY = useTransform(mouseX, [-150, 150], [-6, 6]);

    function handleProfileMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!profileCardRef.current) return;
        const rect = profileCardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = event.clientX - rect.left - width / 2;
        const mouseYFromCenter = event.clientY - rect.top - height / 2;
        mouseX.set(mouseXFromCenter);
        mouseY.set(mouseYFromCenter);
    }

    function handleProfileMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const projectLibrary = [
        {
            id: "lab-map",
            name: "Lab Core Topology Mapping",
            company: "Infrastructure Lab",
            period: "2021",
            details: "Standardized hardware documentation for physical switch stacks. Implemented a logical mapping system to reduce fault detection time.",
            tech: ["Cisco IOS", "Network Topology", "Visio"],
            metrics: ["120+ Nodes Mapped", "Zero downtime migration"]
        },
        {
            id: "auto-pipeline",
            name: "Automated Pipeline Runtime",
            company: "Data Operations Corp",
            period: "2023",
            details: "Engineered a localized CI/CD wrapper using Bash scripts to automate binary deployments.",
            tech: ["Bash", "Docker", "Linux Kernel"],
            metrics: ["5min Deployment reduction", "Automated rollbacks"]
        },
        {
            id: "supabase-core",
            name: "Supabase Architecture Layer",
            company: "arly.dev",
            period: "2024",
            details: "Designed a clean server-side data fetching layer using Supabase SSR to manage secure profile identification.",
            tech: ["PostgreSQL", "Next.js", "TypeScript"],
            metrics: ["99.9% uptime", "Sub-200ms latency"]
        }
    ];

    const experiences = [
        {
            period: "2021 — 2022",
            role: "Network Technician",
            company: "Infrastructure Lab",
            description: "Managed physical switches and performed hardware systems fault diagnostics.",
            linkedProjects: ["lab-map"]
        },
        {
            period: "2022 — 2024",
            role: "Junior DevOps Specialist",
            company: "Data Operations Corp",
            description: "Built automated shell runtimes and maintained microservice containment workflows.",
            linkedProjects: ["auto-pipeline"]
        },
        {
            period: "2024 — Present",
            role: "Core System Engineer",
            company: "arly.dev",
            description: "Structuring reliable data processing routines and optimized SQL queries.",
            linkedProjects: ["supabase-core"]
        }
    ];

    useEffect(() => {
        const supabase = createClient();
        async function initializeAndFetch() {
            try {
                const targetUuid = process.env.NEXT_PUBLIC_USER_UUID || process.env.UUID;
                if (targetUuid) {
                    const { data, error } = await supabase.from('profiles').select('*').eq('profile_id', targetUuid).single();
                    if (!error && data) {
                        setMyProfile(data);
                        setIsDatabaseOnline(true);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        initializeAndFetch();
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const sections = document.querySelectorAll("section[id]");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        }, { rootMargin: "-45% 0px -45% 0px" });
        sections.forEach((section) => observer.observe(section));
        return () => sections.forEach((section) => observer.unobserve(section));
    }, [isLoading]);


    const handleProjectClick = (projectId: string) => {
        setSearchQuery("");
        setTimeout(() => {
            document.getElementById(`card-${projectId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const navigationLinks = [
        { label: "Home", id: "home", icon: <Home size={13} /> },
        { label: "Experience", id: "experience", icon: <Briefcase size={13} /> },
        { label: "Projects", id: "project", icon: <FolderGit2 size={13} /> },
        { label: "Profile", id: "profile", icon: <User size={13} /> },
    ];

    const filteredProjects = projectLibrary.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-zinc-950 text-zinc-500' : 'bg-zinc-50 text-zinc-400'} font-mono text-xs tracking-widest animate-pulse`}>
                SYSTEM_BOOTING...
            </div>
        );
    }

    const cleanPhoneForWhatsApp = myProfile?.no_hp ? myProfile.no_hp.replace(/[^0-9]/g, '') : '';

    const resolveLinkType = (linkStr: string, defaultLabel: string = 'Website') => {
        if (!linkStr) return null;
        const cleanStr = linkStr.toLowerCase();

        if (cleanStr.includes('github.com') || (!cleanStr.startsWith('http') && cleanStr.includes('github'))) {
            const formattedUrl = linkStr.startsWith('http') ? linkStr : `https://github.com/${linkStr}`;
            return {
                url: formattedUrl,
                label: 'GitHub',
                icon: (
                    <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-600'}`} fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                )
            };
        }

        if (cleanStr.includes('linkedin.com') || (!cleanStr.startsWith('http') && cleanStr.includes('linkedin'))) {
            const formattedUrl = linkStr.startsWith('http') ? linkStr : `https://linkedin.com/in/${linkStr}`;
            return {
                url: formattedUrl,
                label: 'LinkedIn',
                icon: (
                    <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-600'}`} fill="currentColor">
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.765s.784-1.765 1.75-1.765 1.75.79 1.75 1.765-.784 1.765-1.75 1.765zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.766c1.397-2.567 5.016-2.74 5.016 1.438v5.796z" />
                    </svg>
                )
            };
        }

        const formattedUrl = linkStr.startsWith('http') ? linkStr : `https://${linkStr}`;
        return {
            url: formattedUrl,
            label: defaultLabel,
            icon: <Globe size={16} className={`transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-600'}`} />
        };
    };

    const link1 = myProfile?.link_1 ? resolveLinkType(myProfile.link_1, 'Website') : null;
    const link2 = myProfile?.link_2 ? resolveLinkType(myProfile.link_2, 'Website') : null;
    const link3 = myProfile?.link_3 ? resolveLinkType(myProfile.link_3, 'Website') : null;

    return (
        <div className={`relative h-screen overflow-y-auto overflow-x-hidden select-none font-sans antialiased snap-y snap-mandatory scroll-smooth transition-colors duration-1000 ${
            isDarkMode
                ? 'bg-zinc-950 text-zinc-100'
                // Restored your exact favorite sky color palette here
                : 'bg-gradient-to-br from-orange-50 via-sky-50 to-blue-100 text-zinc-900'
        }`}>

            {/* ATMOSPHERIC LAYER */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {isDarkMode ? (
                    <div className="absolute inset-0 opacity-40">
                        <div className="stars-twinkle w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    </div>
                ) : (
                    /* Clouds: Changed from hard blocks to high-radius gradients with zero blocky edges */
                    <div className="absolute inset-0 opacity-60 pointer-events-none transform-gpu">
                        {/* Cloud 1: High blur spreading out into an organic atmospheric haze */}
                        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[400px] bg-gradient-to-br from-white/40 to-transparent rounded-full blur-[120px]"></div>
                        {/* Cloud 2: Balanced bottom horizon mist */}
                        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[500px] bg-gradient-to-tl from-white/30 to-transparent rounded-full blur-[140px]"></div>
                    </div>
                )}
            </div>

            {/* FULL-PAGE NAVIGATION GRID */}
            <nav className={`backdrop-blur-md border-b fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950/80 border-zinc-900/50' : 'bg-white/70 border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.02)]'}`}>
                <div className="w-full px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">

                    {/* Far Left Column */}
                    <div className="flex justify-start">
                        <motion.a
                            draggable="false"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="#home"
                            className="text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
                        >
                            Arly.dev
                        </motion.a>
                    </div>

                    {/* Centered Navigation Menu */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {navigationLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    draggable="false"
                                    className={`relative flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                                        activeSection === link.id
                                            ? (isDarkMode ? "text-indigo-400 font-semibold" : "text-indigo-600 font-semibold")
                                            : (isDarkMode ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-800")
                                    }`}
                                >
                                    {activeSection === link.id && (
                                        <motion.span
                                            layoutId="navIndicator"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            className={`absolute inset-0 border rounded-lg -z-10 ${isDarkMode ? 'bg-zinc-900 border-zinc-800/60' : 'bg-zinc-100 border-zinc-200/50'}`}
                                        />
                                    )}
                                    {link.icon} <span className="hidden sm:inline">{link.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Far Right Column */}
                    <div className="flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}
                            aria-label="Toggle structural theme template"
                        >
                            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* 1. HOME */}
            <section id="home" className="w-full h-screen flex flex-col justify-center items-center snap-start px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className={`absolute top-24 right-4 sm:right-6 lg:right-8 z-20 inline-flex items-center gap-2 border px-3 py-1 rounded-full text-[10px] font-mono tracking-widest transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400' : 'bg-zinc-100/80 border-zinc-200 text-zinc-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isDatabaseOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                    {"NODE_STATUS: "}{isDatabaseOnline ? 'ONLINE' : 'FAULT'}
                </div>

                <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isDarkMode ? 'bg-indigo-500/[0.03]' : 'bg-indigo-500/[0.05]'}`} />

                <div className="space-y-6 max-w-4xl z-10 text-center flex flex-col items-center justify-center">
                    <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
                        Reliable backend <br /> <span className={`transition-colors duration-300 ${isDarkMode ? 'text-zinc-600 hover:text-zinc-500' : 'text-zinc-300 hover:text-zinc-400'}`}>infrastructure.</span>
                    </h1>

                    <p className={`text-lg sm:text-xl font-light leading-relaxed max-w-3xl ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        A Backend Developer specialized in clean, maintainable server-side solutions, with cross-functional competencies in DevOps, networking, and hardware systems.
                    </p>

                    <div className="pt-4">
                        <motion.a
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            href="#experience"
                            draggable="false"
                            className={`text-xs font-bold px-6 py-3 rounded-full inline-block shadow-lg transition-all ${isDarkMode ? 'bg-zinc-100 text-zinc-950 hover:shadow-zinc-100/10' : 'bg-zinc-900 text-white hover:shadow-zinc-900/10'}`}
                        >
                            Explore Experience
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* 2. EXPERIENCE */}
            <section id="experience" className={`w-full h-screen flex flex-col justify-center snap-start px-4 sm:px-6 lg:px-8 border-t overflow-hidden ${isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200/60'}`}>
                <div className="max-w-5xl mx-auto mb-12 flex items-end justify-between w-full">
                    <div>
                        <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Professional Journey</h2>
                        <p className={`text-sm mt-1 flex items-center gap-1.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                            <Sparkles size={13} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-50'} /> Swipe or drag horizontally to snap between cards.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const newIndex = Math.max(0, activeExpIndex - 1);
                                setActiveExpIndex(newIndex);
                                document.getElementById(`exp-card-${newIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }}
                            disabled={activeExpIndex === 0}
                            className={`p-2.5 border rounded-full transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:bg-zinc-900'}`}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => {
                                const newIndex = Math.min(experiences.length - 1, activeExpIndex + 1);
                                setActiveExpIndex(newIndex);
                                document.getElementById(`exp-card-${newIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                            }}
                            disabled={activeExpIndex === experiences.length - 1}
                            className={`p-2.5 border rounded-full transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:bg-zinc-900'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Native CSS Snap Carousel Deck with Exact Center Padding */}
                <div className="relative w-full max-w-5xl mx-auto flex justify-center items-center h-[360px]">
                    <div className={`absolute left-0 right-0 h-[2px] top-1/2 -translate-y-1/2 -z-10 ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-200'}`} />

                    <div
                        ref={(el) => {
                            if (el && el.scrollLeft === 0 && activeExpIndex !== undefined) {
                                el.scrollLeft = activeExpIndex * 380;
                            }
                        }}
                        onScroll={(e) => {
                            const scrollLeft = e.currentTarget.scrollLeft;
                            const cardWidth = 380; // 340px card + 40px gap (gap-10)
                            const index = Math.round(scrollLeft / cardWidth);
                            if (index >= 0 && index < experiences.length && index !== activeExpIndex) {
                                setActiveExpIndex(index);
                            }
                        }}
                        className="flex items-center absolute inset-x-0 gap-10 px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth h-full py-7 items-center hide-scrollbar"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {experiences.map((exp, idx) => {
                            const isFocused = activeExpIndex === idx;
                            const isCurrent = idx === experiences.length - 1;

                            return (
                                <div
                                    id={`exp-card-${idx}`}
                                    key={idx}
                                    className="snap-center shrink-0 flex items-center justify-center first:pl-[calc(50%-170px)] last:pr-[calc(50%-170px)]"
                                >
                                    <div
                                        className={`min-w-[340px] max-w-[340px] h-[300px] border p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 select-none shadow-2xl backdrop-blur-md ${
                                            isFocused
                                                ? (isDarkMode
                                                    ? 'bg-zinc-900/60 border-zinc-700/80 shadow-indigo-500/10 scale-105 -translate-y-2.5'
                                                    : 'bg-white border-zinc-100 shadow-indigo-500/5 scale-105 -translate-y-2.5')
                                                : (isDarkMode
                                                    ? 'bg-zinc-950/40 border-zinc-900/50 scale-100 translate-y-0 opacity-45'
                                                    : 'bg-zinc-50/50 border-zinc-200/30 scale-100 translate-y-0 opacity-45')
                                        }`}
                                    >
                                        <div className="h-3.5 flex items-center relative justify-between">
                                            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${
                                                isCurrent
                                                    ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_16px_rgba(99,102,241,0.8)] scale-110'
                                                    : (isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-300')
                                            }`} />

                                            {/* Blinking Beacon Notification for the Current/Present Role */}
                                            {isCurrent && (
                                                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                                    <span className="text-[9px] font-mono tracking-wider font-extrabold text-indigo-400 uppercase">ACTIVE_DUTY</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 mt-2">
                                            <span className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{exp.period}</span>
                                            <h3 className={`font-black text-xl leading-tight transition-colors tracking-tight ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>{exp.role}</h3>
                                            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{exp.company}</p>
                                            <p className={`text-xs font-light leading-relaxed line-clamp-3 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{exp.description}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed border-zinc-800/40 mt-2">
                                            {exp.linkedProjects.map(pid => (
                                                <button
                                                    key={pid}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProjectClick(pid);
                                                    }}
                                                    className={`text-[9px] border px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 cursor-pointer font-semibold uppercase tracking-wider ${
                                                        isDarkMode
                                                            ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-indigo-400'
                                                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-indigo-600'
                                                    }`}
                                                >
                                                    <FolderGit2 size={9} className={isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} />
                                                    <span className="truncate max-w-[150px]">{projectLibrary.find(p => p.id === pid)?.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <style jsx global>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </section>

            {/* 3. PROJECT GALLERY */}
            <section id="project" className={`w-full min-h-screen h-auto flex flex-col justify-center snap-start px-4 sm:px-6 lg:px-8 py-20 border-t ${isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200/60'}`}>
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full max-w-6xl mx-auto">
                    <div>
                        <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Project Library</h2>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>A complete modular collection of production environments and logic layers.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Search size={14} className={isDarkMode ? 'text-zinc-600' : 'text-zinc-400'} />
                        </span>
                        <input
                            type="text"
                            placeholder="QUERY_TITLE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-8 py-2 border rounded-xl font-mono text-xs transition-all tracking-wider focus:outline-none focus:ring-1 ${
                                isDarkMode
                                    ? 'bg-zinc-950/60 border-zinc-900 text-zinc-200 placeholder-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/30'
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-indigo-600 focus:ring-indigo-600/20'
                            }`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 rounded transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200'}`}
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative min-h-[300px] w-full max-w-6xl mx-auto flex justify-center items-center">
                    <motion.div
                        layout
                        className="flex flex-wrap justify-center gap-6 w-full mx-auto"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    id={`card-${project.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.85, y: -10 }}
                                    whileHover={{ y: -6 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 320,
                                        damping: 24,
                                        opacity: { duration: 0.25 }
                                    }}
                                    className={`border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm transition-colors shadow-md group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md ${
                                        isDarkMode ? 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800' : 'bg-zinc-50/50 border-zinc-200 hover:border-zinc-300'
                                    }`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className={`text-[9px] font-mono font-bold tracking-widest uppercase border px-2 py-0.5 rounded ${
                                                isDarkMode ? 'text-indigo-400 bg-indigo-950/40 border-indigo-900/20' : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                                            }`}>
                                                {project.company}
                                            </span>
                                            <span className={`text-[10px] font-mono ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>{project.period}</span>
                                        </div>

                                        <h3 className={`text-xl font-bold tracking-tight leading-snug transition-colors ${isDarkMode ? 'text-zinc-50 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'}`}>
                                            {project.name}
                                        </h3>

                                        <p className={`text-xs font-light leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            {project.details}
                                        </p>

                                        <div className={`p-3.5 rounded-xl border space-y-2 ${isDarkMode ? 'bg-zinc-950/50 border-zinc-900/80' : 'bg-white border-zinc-200/60'}`}>
                                            <h4 className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                <Terminal size={10} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} /> System_Impact
                                            </h4>
                                            <div className="space-y-1.5">
                                                {project.metrics.map((metric) => (
                                                    <div key={metric} className={`flex items-start gap-2 text-[11px] font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                                        <CheckCircle2 size={12} className="text-emerald-500/80 mt-0.5 shrink-0" />
                                                        <span>{metric}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-5 mt-4 border-t flex flex-col gap-3 justify-end h-auto shrink-0 border-dashed border-zinc-800/60">
                                        <div className="flex flex-wrap gap-1">
                                            {project.tech.map((t) => (
                                                <span key={t} className={`border px-2 py-0.5 font-mono text-[9px] rounded ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-500'}`}>{t}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                                            <span className={isDarkMode ? 'text-zinc-700' : 'text-zinc-400'}>{"0x"}{project.id.toUpperCase()}</span>
                                            <a href="#" draggable="false" className={`font-bold uppercase flex items-center gap-0.5 transition-all ${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-800'}`}>
                                                Source <ArrowUpRight size={11} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProjects.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`border border-dashed rounded-2xl p-12 text-center font-mono text-xs tracking-wider space-y-3 w-full max-w-2xl mx-auto absolute ${
                                isDarkMode ? 'bg-zinc-900/10 border-zinc-900 text-zinc-600' : 'bg-zinc-50/50 border-zinc-200 text-zinc-400'
                            }`}
                        >
                            <div>ERR_NO_MATCHING_NODES_FOUND_FOR: "{searchQuery}"</div>
                            <button
                                onClick={() => setSearchQuery("")}
                                className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                                    isDarkMode
                                        ? 'bg-zinc-900 border-zinc-800 text-indigo-400 hover:bg-zinc-800 hover:text-indigo-300'
                                        : 'bg-white border-zinc-200 text-indigo-600 hover:bg-zinc-50 hover:text-indigo-700'
                                }`}
                            >
                                Reset Active Query
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* 4. PROFILE */}
            <section id="profile" className={`w-full h-screen flex flex-col justify-center snap-start px-4 sm:px-6 lg:px-8 border-t ${isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200/60'}`}>
                <div className="mb-10 w-full max-w-5xl mx-auto">
                    <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Identity Record</h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>Verified primary endpoints and routing connection fields.</p>
                </div>

                <motion.div
                    ref={profileCardRef}
                    onMouseMove={handleProfileMouseMove}
                    onMouseLeave={handleProfileMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`border p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative w-full max-w-5xl mx-auto group select-none ${
                        isDarkMode ? 'bg-gradient-to-b from-zinc-900/30 to-zinc-950 border-zinc-900' : 'bg-gradient-to-b from-zinc-50 to-white border-zinc-200'
                    }`}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-10 flex-1" style={{ transform: "translateZ(30px)" }}>
                        <div className="relative shrink-0">
                            <div className="absolute -inset-4 bg-indigo-500/[0.02] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {myProfile?.image || myProfile?.avatar_url || myProfile?.profile_image ? (
                                <img
                                    src={myProfile.image || myProfile.avatar_url || myProfile.profile_image}
                                    alt="Profile"
                                    draggable="false"
                                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-xl relative z-10 border ${isDarkMode ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'}`}
                                />
                            ) : (
                                <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border flex items-center justify-center text-4xl font-bold relative z-10 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>A</div>
                            )}
                        </div>
                        <div className="text-center sm:text-left space-y-4">
                            <div>
                                <h3 className={`text-4xl font-bold tracking-tight ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>{myProfile?.name || "Arly"}</h3>
                                <p className={`font-medium text-base mt-0.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{myProfile?.job || "Backend Developer"}</p>
                            </div>
                            <div className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border shadow-inner ${isDarkMode ? 'text-zinc-400 bg-zinc-900/60 border-zinc-800' : 'text-zinc-600 bg-zinc-100 border-zinc-200'}`}>
                                <MapPin size={13} className={isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} /> {myProfile?.location || "Remote Node"}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-72 shrink-0" style={{ transform: "translateZ(20px)" }}>
                        {myProfile?.email && (
                            <a
                                href={`mailto:${myProfile.email}`}
                                draggable="false"
                                className={`flex items-center justify-between p-3 border rounded-xl transition-all group cursor-pointer ${
                                    isDarkMode ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Mail size={15} className={`transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-600'}`} />
                                    <span className={`text-xs truncate max-w-[170px] transition-colors ${isDarkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>{myProfile.email}</span>
                                </div>
                                <ArrowUpRight size={13} className={`opacity-40 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                            </a>
                        )}
                        {myProfile?.no_hp && (
                            <a
                                href={`https://wa.me/${cleanPhoneForWhatsApp}`}
                                target="_blank"
                                rel="noreferrer"
                                draggable="false"
                                className={`flex items-center justify-between p-3 border rounded-xl transition-all group cursor-pointer ${
                                    isDarkMode ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Phone size={15} className={`transition-colors ${isDarkMode ? 'text-zinc-500 group-hover:text-indigo-400' : 'text-zinc-400 group-hover:text-indigo-600'}`} />
                                    <span className={`text-xs transition-colors ${isDarkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>{myProfile.no_hp}</span>
                                </div>
                                <ArrowUpRight size={13} className={`opacity-40 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                            </a>
                        )}

                        {link1 && (
                            <a
                                href={link1.url}
                                target="_blank"
                                rel="noreferrer"
                                draggable="false"
                                className={`flex items-center justify-between p-3 border rounded-xl transition-all group cursor-pointer ${
                                    isDarkMode ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {link1.icon}
                                    <span className={`text-xs transition-colors ${isDarkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                                        {link1.label}
                                    </span>
                                </div>
                                <ArrowUpRight size={13} className={`opacity-40 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                            </a>
                        )}

                        {link2 && (
                            <a
                                href={link2.url}
                                target="_blank"
                                rel="noreferrer"
                                draggable="false"
                                className={`flex items-center justify-between p-3 border rounded-xl transition-all group cursor-pointer ${
                                    isDarkMode ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {link2.icon}
                                    <span className={`text-xs transition-colors ${isDarkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                                        {link2.label}
                                    </span>
                                </div>
                                <ArrowUpRight size={13} className={`opacity-40 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                            </a>
                        )}

                        {link3 && (
                            <a
                                href={link3.url}
                                target="_blank"
                                rel="noreferrer"
                                draggable="false"
                                className={`flex items-center justify-between p-3 border rounded-xl transition-all group cursor-pointer ${
                                    isDarkMode ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {link3.icon}
                                    <span className={`text-xs transition-colors ${isDarkMode ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                                        {link3.label}
                                    </span>
                                </div>
                                <ArrowUpRight size={13} className={`opacity-40 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                            </a>
                        )}
                    </div>
                </motion.div>
            </section>
        </div>
    );
}