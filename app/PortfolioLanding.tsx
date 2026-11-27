"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetchAndProcessPortfolioData } from '@/utils/portfolio';
import { useAppContext } from '@/providers/AppProvider';
import Hero from '@/components/sections/Hero';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Profile from '@/components/sections/Profile';
import ProjectDetailModal from '@/components/ProjectDetailModal';
import RecruiterQuickViewModal from '@/components/RecruiterQuickViewModal';
import { ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectLibraryModal from '@/components/ProjectLibraryModal';
import { navigationLinks } from '@/components/Navbar';

interface PortfolioLandingProps {
    initialProfile: Record<string, any> | null;
    initialExperiences: any[];
    initialEducations: any[];
    initialProjectLibrary: any[];
    initialSkills: any[];
}

export default function PortfolioLanding({
    initialProfile,
    initialExperiences,
    initialEducations,
    initialProjectLibrary,
    initialSkills
}: PortfolioLandingProps) {
    const [myProfile, setMyProfile] = useState<Record<string, any> | null>(initialProfile);
    const [experiences, setExperiences] = useState<any[]>(initialExperiences);
    const [educations, setEducations] = useState<any[]>(initialEducations);
    const [projectLibrary, setProjectLibrary] = useState<any[]>(initialProjectLibrary);
    const [skills, setSkills] = useState<any[]>(initialSkills);

    const [isLoading, setIsLoading] = useState(!initialProfile);
    const [isDatabaseOnline, setIsDatabaseOnline] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
    const [debugError, setDebugError] = useState<string | null>(null);
    const { activeSection, setActiveSection, isManualScrolling, isDarkMode } = useAppContext();

    useEffect(() => {
        const supabase = createClient();
        async function initializeAndFetch() {
            try {
                const targetUuid = process.env.NEXT_PUBLIC_USER_UUID;
                if (!targetUuid) {
                    setIsLoading(false);
                    return;
                }

                const fetchPromise = fetchAndProcessPortfolioData(supabase, targetUuid);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Client database connection timeout")), 4000)
                );

                const processed: any = await Promise.race([fetchPromise, timeoutPromise]);

                setMyProfile(processed.myProfile);
                setExperiences(processed.experiences);
                setEducations(processed.educations);
                setProjectLibrary(processed.projectLibrary);
                setSkills(processed.skills);
                setIsDatabaseOnline(true);

            } catch (err: any) {
                console.error("System Relational Assembly Fault:", err);
                setDebugError(err.message || String(err));
                setIsDatabaseOnline(false);
            } finally {
                setIsLoading(false);
            }
        }
        initializeAndFetch();

        // Debounce incoming database updates to prevent refetch floods
        let debounceTimer: ReturnType<typeof setTimeout> | null = null;
        const relevantTables = ['profiles', 'experiences', 'educations', 'projects', 'skills', 'project_skills'];

        let channel = supabase.channel('schema-db-changes');
        relevantTables.forEach((table) => {
            channel = channel.on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                (payload) => {
                    if (debounceTimer) clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        console.log(`Supabase Realtime Triggered for ${table}:`, payload);
                        initializeAndFetch();
                    }, 800);
                }
            );
        });

        channel.subscribe((status) => {
            console.log('Supabase Realtime Status:', status);
        });

        return () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            supabase.removeChannel(channel);
        };
    }, []);

    const filteredProjects = projectLibrary.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tech.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleProjectClick = (projectId: string) => {
        const project = projectLibrary.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
        }
    };

    const handleSkillClick = (skillName: string) => {
        setSearchQuery(skillName);
        setIsLibraryOpen(true);
    };

    const handleNavigateFromModal = (targetId: string) => {
        setSelectedProject(null);
        setIsLibraryOpen(false);
        setIsRecruiterModalOpen(false);
        document.body.style.overflow = 'unset';
        isManualScrolling.current = true;
        setActiveSection(targetId);
        window.history.replaceState(null, "", `#${targetId}`);
        requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => { isManualScrolling.current = false; }, 2000);
        });
    };

    useEffect(() => {
        if (isLoading) return;
        const sections = document.querySelectorAll("section[id]");

        const observer = new IntersectionObserver((entries) => {
            if (isManualScrolling.current) return;
            const visible = entries.find(e => e.isIntersecting);
            if (visible) {
                setActiveSection(visible.target.id);
            }
        }, { rootMargin: "-45% 0px -45% 0px" });

        sections.forEach(s => observer.observe(s));
        return () => sections.forEach(s => observer.unobserve(s));
    }, [isLoading]);

    // Keep the browser tab title in sync with the section currently in view
    useEffect(() => {
        const label = navigationLinks.find(l => l.id === activeSection)?.label ?? 'Home';
        document.title = `Arly | ${label}`;
    }, [activeSection]);

    const scrollToTop = () => {
        isManualScrolling.current = true;
        setActiveSection('home');
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { isManualScrolling.current = false; }, 2000);
    };

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-zinc-950 text-zinc-500' : 'bg-zinc-50 text-zinc-400'} font-sans text-sm tracking-wide animate-pulse`}>
                Loading...
            </div>
        );
    }

    return (
        <>
            {debugError && (
                <div className="fixed top-20 left-4 right-4 bg-rose-50/90 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 p-4 rounded-2xl z-50 text-sm font-sans backdrop-blur-md shadow-lg">
                    Unable to load latest live data. Showing offline snapshot.
                </div>
            )}

            <main>
            {/* ═══════════════════════ 1. HOME HERO ═══════════════════════ */}
            <Hero
                isDarkMode={isDarkMode}
                isDatabaseOnline={isDatabaseOnline}
                myProfile={myProfile}
                onOpenRecruiterModal={() => setIsRecruiterModalOpen(true)}
            />

            <div className={`w-full h-px bg-linear-to-r ${isDarkMode ? 'from-transparent via-zinc-800 to-transparent' : 'from-transparent via-zinc-300 to-transparent'}`} />

            {/* ═══════════════════════ 2. EXPERIENCE ═══════════════════════ */}
            <Experience
                isDarkMode={isDarkMode}
                experiences={experiences}
                projectLibrary={projectLibrary}
                handleProjectClick={handleProjectClick}
            />

            <div className={`w-full h-px bg-linear-to-r ${isDarkMode ? 'from-transparent via-zinc-800 to-transparent' : 'from-transparent via-zinc-300 to-transparent'}`} />

            {/* ═══════════════════════ 3. PROJECT LIBRARY ═══════════════════════ */}
            <Projects
                isDarkMode={isDarkMode}
                projects={projectLibrary}
                onProjectClick={handleProjectClick}
                onExploreClick={() => setIsLibraryOpen(true)}
            />

            <div className={`w-full h-px bg-linear-to-r ${isDarkMode ? 'from-transparent via-zinc-800 to-transparent' : 'from-transparent via-zinc-300 to-transparent'}`} />

            {/* ═══════════════════════ 3.5 SKILLS ═══════════════════════ */}
            <Skills
                isDarkMode={isDarkMode}
                skills={skills}
                handleSkillClick={handleSkillClick}
            />

            <div className={`w-full h-px bg-linear-to-r ${isDarkMode ? 'from-transparent via-zinc-800 to-transparent' : 'from-transparent via-zinc-300 to-transparent'}`} />

            {/* ═══════════════════════ 4. PROFILE ═══════════════════════ */}
            <Profile
                isDarkMode={isDarkMode}
                myProfile={myProfile}
                educations={educations}
                projectLibrary={projectLibrary}
                handleProjectClick={handleProjectClick}
                scrollToTop={scrollToTop}
            />

            <div className={`w-full h-px bg-linear-to-r ${isDarkMode ? 'from-transparent via-zinc-800 to-transparent' : 'from-transparent via-zinc-300 to-transparent'}`} />

            {/* ═══════════════════════ FOOTER ═══════════════════════ */}
            <footer className={`w-full py-8 sm:py-12 px-4 border-t ${isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200/60'} mt-8 sm:mt-16 relative z-10`}>
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                    <motion.button
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className={`p-4 rounded-2xl border shadow-md transition-colors ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50'}`}
                        aria-label="Scroll to top"
                    >
                        <ChevronUp size={20} />
                    </motion.button>
                    <div className={`flex flex-col items-center gap-2 text-xs font-bold tracking-widest ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        <span>© {new Date().getFullYear()} — All Rights Reserved</span>
                    </div>
                </div>
            </footer>
            </main>

            <ProjectLibraryModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                isDarkMode={isDarkMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredProjects={filteredProjects}
                onProjectClick={handleProjectClick}
            />

            <ProjectDetailModal
                isOpen={!!selectedProject}
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                onNavigateSection={handleNavigateFromModal}
                isDarkMode={isDarkMode}
            />

            <RecruiterQuickViewModal
                isOpen={isRecruiterModalOpen}
                onClose={() => setIsRecruiterModalOpen(false)}
                isDarkMode={isDarkMode}
                myProfile={myProfile}
                skills={skills}
                projectLibrary={projectLibrary}
                educations={educations}
                onProjectClick={handleProjectClick}
            />
        </>
    );
}
