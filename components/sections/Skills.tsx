import React, { useMemo } from 'react';
import {
    Database, 
    Server, 
    Cloud, 
    Smartphone, 
    Globe, 
    Wrench, 
    Layers, 
    Network, 
    Eye, 
    Cpu 
} from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { sanitizeHttpUrl } from '@/utils/url';

const getCategoryIcon = (category: string, size = 18) => {
    const cat = category?.toLowerCase() || '';

    // IoT & Computer Vision
    if (cat.includes('iot') || cat.includes('vision') || cat.includes('computer vision')) {
        return <Eye size={size} className="text-violet-500 dark:text-violet-400" />;
    }
    // Network Administration
    if (cat.includes('network')) {
        return <Network size={size} className="text-cyan-500 dark:text-cyan-400" />;
    }
    // Database Management
    if (cat.includes('database') || cat.includes('storage') || cat.includes('sql')) {
        return <Database size={size} className="text-emerald-500 dark:text-emerald-400" />;
    }
    // DevOps & Cloud
    if (cat.includes('devops') || cat.includes('cloud') || cat.includes('ci/cd')) {
        return <Cloud size={size} className="text-sky-500 dark:text-sky-400" />;
    }
    // Backend Developer
    if (cat.includes('backend') || cat.includes('api') || cat.includes('server')) {
        return <Server size={size} className="text-orange-500 dark:text-orange-400" />;
    }
    // Mobile
    if (cat.includes('mobile') || cat.includes('android') || cat.includes('ios')) {
        return <Smartphone size={size} className="text-purple-500 dark:text-purple-400" />;
    }
    // Frontend / Web
    if (cat.includes('frontend') || cat.includes('web') || cat.includes('ui')) {
        return <Globe size={size} className="text-purple-700 dark:text-purple-400" />;
    }
    // Tools / System / Embedded
    if (cat.includes('hardware') || cat.includes('embedded')) {
        return <Cpu size={size} className="text-amber-500 dark:text-amber-400" />;
    }
    if (cat.includes('tool') || cat.includes('system')) {
        return <Wrench size={size} className="text-teal-500 dark:text-teal-400" />;
    }

    return <Layers size={size} className="text-purple-700 dark:text-purple-400" />;
};

const SkillCard = ({ category, icon, items, isLarge, isDarkMode, handleSkillClick, delay }: SkillCardProps) => {
    return (
        <ScrollReveal
            delay={delay}
            className={`border rounded-3xl sm:rounded-4xl p-5 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 relative overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 group w-full
                ${isLarge ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}
                ${isDarkMode
                    ? 'bg-linear-to-br from-zinc-900/90 to-zinc-950/90 border-zinc-800/80 hover:border-purple-500/50 hover:shadow-[0_8px_24px_rgb(147,51,234,0.12)]'
                    : 'bg-linear-to-br from-white/95 to-zinc-50/95 border-zinc-200/80 hover:border-purple-700/40 hover:shadow-[0_8px_24px_rgb(107,33,168,0.1)]'
                }`}
        >
            {/* Subtle gradient overlay on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none -z-10 ${isDarkMode ? 'bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent' : 'bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-purple-700/10 via-transparent to-transparent'}`} />

            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                <div className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border shadow-sm transition-colors ${isDarkMode ? 'bg-zinc-800/80 border-zinc-700/50 group-hover:border-purple-500/50 text-purple-400 group-hover:bg-purple-500/10' : 'bg-white border-zinc-200 group-hover:border-purple-300 text-purple-800 group-hover:bg-purple-50'}`}>
                    {icon}
                </div>
                <h3 className={`text-lg sm:text-xl md:text-2xl font-black tracking-tight ${isDarkMode ? 'text-zinc-100 group-hover:text-purple-300 transition-colors' : 'text-zinc-900 group-hover:text-purple-800 transition-colors'}`}>{category}</h3>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mt-1 sm:mt-2 relative z-10">
                {items.map((skill: any) => (
                    <button
                        type="button"
                        key={skill.id || skill.skill_nm}
                        onClick={() => handleSkillClick(skill.skill_nm)}
                        className={`border px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 sm:gap-2.5 cursor-pointer
                            transition-[transform,color,background-color,border-color] duration-150 hover:-translate-y-0.5 active:scale-95 shadow-xs
                            ${isDarkMode
                                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-purple-500/60 hover:bg-purple-500/20'
                                : 'bg-white border-zinc-200/80 text-zinc-700 hover:text-purple-900 hover:border-purple-700/50 hover:bg-purple-50'
                            }`}
                    >
                        <div className="flex items-center justify-center shrink-0 w-5 h-5 bg-transparent rounded-md overflow-hidden">
                            {skill.displayIcon}
                        </div>
                        <span className="truncate">{skill.skill_nm}</span>
                    </button>
                ))}
            </div>
        </ScrollReveal>
    );
};

interface SkillsProps {
    isDarkMode: boolean;
    skills: any[];
    handleSkillClick: (skillName: string) => void;
}

interface SkillCardProps {
    category: string;
    icon: React.ReactNode;
    items: any[];
    isLarge: boolean;
    isDarkMode: boolean;
    handleSkillClick: (skillName: string) => void;
    delay: number;
}


export default function Skills({ isDarkMode, skills, handleSkillClick }: SkillsProps) {
    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';

    // Group skills by category
    const groupedSkills = useMemo(() => {
        const groups: Record<string, { icon: React.ReactNode, items: any[] }> = {};
        skills.forEach(skill => {
            const category = skill.services || 'Other Skills';
            if (!groups[category]) {
                groups[category] = { icon: getCategoryIcon(category, 18), items: [] };
            }
            const safeIconUrl = sanitizeHttpUrl(skill.icon_url);
            const displayIcon = safeIconUrl ? (
                <img src={safeIconUrl} alt={`${skill.skill_nm} icon`} className="w-3.75 h-3.75 object-contain" />
            ) : getCategoryIcon(category, 15);
            
            groups[category].items.push({ ...skill, displayIcon });
        });
        return groups;
    }, [skills]);

    return (
        <section id="skills" className="w-full sm:min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-14 sm:pb-20 relative overflow-hidden">
            <ScrollReveal className="w-full max-w-6xl mx-auto mb-8 sm:mb-16 relative z-10">
                <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Technical Skills</h2>
                <div className={`h-1 w-16 sm:w-20 mt-3 sm:mt-4 rounded-full ${isDarkMode ? 'bg-purple-500/60' : 'bg-purple-700/40'}`} />
                <p className={`text-xs sm:text-base mt-3 sm:mt-6 font-medium ${textMuted}`}>A curated overview of the technologies and tools that power my projects.</p>
            </ScrollReveal>

            <div className="w-full max-w-6xl mx-auto relative z-10">
                {skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {Object.entries(groupedSkills).map(([category, { icon, items }], idx) => {
                            // Bento box pattern: span multiple columns for emphasis
                            const isLarge = idx === 0 || idx === 3 || idx === 5;
                            return (
                                <SkillCard
                                    key={category}
                                    category={category}
                                    icon={icon}
                                    items={items}
                                    isLarge={isLarge}
                                    isDarkMode={isDarkMode}
                                    handleSkillClick={handleSkillClick}
                                    delay={idx * 40}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className={`border border-dashed rounded-4xl p-16 text-center font-sans tracking-wide w-full ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500' : 'bg-white/80 border-zinc-200 text-zinc-400'}`}>
                        No skills found.
                    </div>
                )}
            </div>
        </section>
    );
}

