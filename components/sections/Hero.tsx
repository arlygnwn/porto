import React, { useEffect, useRef, useState } from 'react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { FileDown, Sparkles, ArrowDown } from 'lucide-react';

const heroTypingPhrases = [
    "Reliable backend infrastructure.",
    "Scalable API design.",
    "Clean server-side solutions.",
    "Robust system architecture.",
];

function TypedHeadline({ isDarkMode }: { isDarkMode: boolean }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const [isInView, setIsInView] = useState(true);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.05 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const typedText = useTypingAnimation(heroTypingPhrases, 80, 40, 2000, isInView);

    return (
        <h1
            ref={ref}
            className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.08] sm:leading-none min-h-[2.3em] sm:min-h-[2.2em]"
        >
            <span>{typedText}</span>
            <span className={`inline-block w-[1.5px] h-[0.85em] ml-1 align-middle ${isDarkMode ? 'bg-purple-400' : 'bg-purple-700'}`} />
        </h1>
    );
}

interface HeroProps {
    isDarkMode: boolean;
    isDatabaseOnline: boolean;
    myProfile?: Record<string, any> | null;
    onOpenRecruiterModal?: () => void;
}

export default function Hero({ isDarkMode, isDatabaseOnline, myProfile, onOpenRecruiterModal }: HeroProps) {
    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
    const resumeHref = '/resume';
    const availabilityText = myProfile?.current_status || myProfile?.availability || 'Currently on Contract — Accepting Commissions';

    return (
        <section id="home" className="w-full min-h-[88svh] sm:min-h-screen flex flex-col justify-center items-center px-4 pt-14 md:pt-16 pb-10 sm:pb-0 relative overflow-hidden">
            <div
                className={`absolute top-18 sm:top-24 right-4 inline-flex items-center gap-1.5 sm:gap-2 border px-2.5 sm:px-3 py-1 rounded-full font-mono text-[10px] tracking-wider uppercase font-semibold
                    ${isDatabaseOnline
                        ? (isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600')
                        : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500')
                    }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${isDatabaseOnline ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                {isDatabaseOnline ? 'Live Data Connected' : 'Offline Mode'}
            </div>

            <div className="space-y-4 sm:space-y-6 max-w-6xl text-center z-10">
                <TypedHeadline isDarkMode={isDarkMode} />

                <p className={`text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-normal sm:font-light ${textMuted}`}>
                    A Backend Developer specialized in clean, maintainable server-side solutions, with cross-functional competencies in DevOps, networking, and hardware systems.
                </p>

                {/* Recruiter Availability Badge */}
                <div className="pt-0.5 sm:pt-1 flex justify-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-colors ${
                        isDarkMode 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>{availabilityText}</span>
                    </div>
                </div>

                {/* Recruiter & Exploration Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                    {/* Primary CV Download Button */}
                    <a
                        href={resumeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative text-xs font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-full inline-flex items-center gap-2 shadow-md overflow-hidden group bg-purple-800 hover:bg-purple-700 text-white cursor-pointer transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                        aria-label="Download CV or Resume"
                    >
                        <FileDown size={14} />
                        <span className="relative z-10">Download CV</span>
                    </a>

                    {/* Recruiter Snapshot Modal Trigger */}
                    {onOpenRecruiterModal && (
                        <button
                            onClick={onOpenRecruiterModal}
                            className={`text-xs font-bold px-4 py-2.5 sm:px-5 sm:py-3 rounded-full inline-flex items-center gap-2 border transition-[background-color,transform] duration-150 hover:scale-[1.03] active:scale-[0.97] shadow-sm cursor-pointer ${
                                isDarkMode 
                                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800' 
                                    : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                            }`}
                        >
                            <Sparkles size={14} className={isDarkMode ? 'text-purple-400' : 'text-purple-700'} />
                            <span>Recruiter View</span>
                        </button>
                    )}

                    {/* Secondary Explore Button */}
                    <a
                        href="/#experience"
                        className={`relative text-xs font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-full inline-flex items-center gap-1.5 shadow-sm border overflow-hidden group cursor-pointer transition-[color,border-color,transform] duration-150 hover:scale-[1.03] active:scale-[0.97] ${
                            isDarkMode 
                                ? 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700' 
                                : 'bg-white/80 border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300'
                        }`}
                    >
                        <span className="relative z-10">Explore Work</span>
                        <ArrowDown size={13} className="relative z-10 opacity-70 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}

