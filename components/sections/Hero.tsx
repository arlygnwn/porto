import React from 'react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { motion, Variants } from 'framer-motion';
import { FileDown, Sparkles, ArrowDown } from 'lucide-react';

const heroTypingPhrases = [
    "Reliable backend infrastructure.",
    "Scalable API design.",
    "Clean server-side solutions.",
    "Robust system architecture.",
];

interface HeroProps {
    isDarkMode: boolean;
    isDatabaseOnline: boolean;
    myProfile?: Record<string, any> | null;
    onOpenRecruiterModal?: () => void;
}

export default function Hero({ isDarkMode, isDatabaseOnline, myProfile, onOpenRecruiterModal }: HeroProps) {
    const typedText = useTypingAnimation(heroTypingPhrases);
    const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
    const resumeHref = '/resume';
    const availabilityText = myProfile?.current_status || myProfile?.availability || 'Currently on Contract — Accepting Commissions';

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] } }
    };

    return (
        <section id="home" className="w-full min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
            {/* Interactive floating particles or shapes could go here later */}

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className={`absolute top-24 right-4 inline-flex items-center gap-2 border px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold
                    ${isDatabaseOnline
                        ? (isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600')
                        : (isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500')
                    }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${isDatabaseOnline ? 'bg-emerald-500' : 'bg-zinc-400'} animate-pulse`} />
                {isDatabaseOnline ? 'Live Data Connected' : 'Offline Mode'}
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 max-w-6xl text-center z-10"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none min-h-[2.2em]"
                >
                    <span>{typedText}</span>
                    <span className={`inline-block w-[1.5px] h-[0.85em] ml-1 align-middle animate-pulse ${isDarkMode ? 'bg-purple-400' : 'bg-purple-700'}`} />
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className={`text-lg sm:text-xl font-light ${textMuted}`}
                >
                    A Backend Developer specialized in clean, maintainable server-side solutions, with cross-functional competencies in DevOps, networking, and hardware systems.
                </motion.p>

                {/* Recruiter Availability Badge */}
                <motion.div variants={itemVariants} className="pt-1 flex justify-center">
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-colors ${
                        isDarkMode 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>{availabilityText}</span>
                    </div>
                </motion.div>

                {/* Recruiter & Exploration Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {/* Primary CV Download Button */}
                    <motion.a
                        href={resumeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative text-xs font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg overflow-hidden group bg-purple-800 hover:bg-purple-700 text-white cursor-pointer"
                        aria-label="Download CV or Resume"
                    >
                        <FileDown size={15} />
                        <span className="relative z-10">Download CV</span>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                    </motion.a>

                    {/* Recruiter Snapshot Modal Trigger */}
                    {onOpenRecruiterModal && (
                        <motion.button
                            onClick={onOpenRecruiterModal}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`text-xs font-bold px-5 py-3 rounded-full inline-flex items-center gap-2 border transition-colors shadow-sm cursor-pointer ${
                                isDarkMode 
                                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800' 
                                    : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                            }`}
                        >
                            <Sparkles size={14} className={isDarkMode ? 'text-purple-400' : 'text-purple-700'} />
                            <span>Recruiter View</span>
                        </motion.button>
                    )}

                    {/* Secondary Explore Button */}
                    <motion.a
                        href="/#experience"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative text-xs font-bold px-6 py-3 rounded-full inline-flex items-center gap-1.5 shadow-sm border overflow-hidden group cursor-pointer ${
                            isDarkMode 
                                ? 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700' 
                                : 'bg-white/80 border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-300'
                        }`}
                    >
                        <span className="relative z-10">Explore Work</span>
                        <ArrowDown size={13} className="relative z-10 opacity-70 group-hover:translate-y-0.5 transition-transform" />
                    </motion.a>
                </motion.div>
            </motion.div>
        </section>
    );
}

