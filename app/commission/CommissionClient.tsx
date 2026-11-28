"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, ChevronUp, Server, Database, Cloud,
    Terminal, Zap, CheckCircle2, ChevronDown
} from 'lucide-react';
import { useAppContext } from '@/providers/AppProvider';

const services = [
    {
        title: "API Architecture",
        desc: "High-performance, scalable REST & GraphQL APIs tailored for your business needs.",
        icon: <Server size={24} />,
        tech: ["Java", "Go", "Python"]
    },
    {
        title: "Database Optimization",
        desc: "Schema design, query tuning, and migration strategies for robust data layers.",
        icon: <Database size={24} />,
        tech: ["PostgreSQL", "Redis", "MariaDB"]
    },
    {
        title: "DevOps & CI/CD",
        desc: "Automated deployment pipelines and containerized infrastructure setup.",
        icon: <Cloud size={24} />,
        tech: ["Docker", "GitHub", "AWS"]
    }
];

const faqs = [
    {
        question: "How do you price your projects?",
        answer: "I typically quote a fixed price based on the project scope and complexity after our initial consultation. For ongoing or undefined scopes, I offer a competitive hourly rate."
    },
    {
        question: "What is your typical turnaround time?",
        answer: "It depends heavily on the project size. Small API integrations can take 1-2 weeks, while full backend architectures might take 1-3 months. I will give you a clear timeline before we start."
    },
    {
        question: "Do you work with existing codebases?",
        answer: "Absolutely. A significant part of my work involves auditing, refactoring, and optimizing legacy backend systems to improve performance and maintainability."
    }
];

export default function CommissionClient() {
    const { isDarkMode } = useAppContext();
    const [wizardStep, setWizardStep] = useState(0); // 0: Start, 1: Service, 2: Timeline, 3: Success/Mailto

    // Wizard state
    const [selectedService, setSelectedService] = useState("");
    const [selectedTimeline, setSelectedTimeline] = useState("");

    const handleServiceSelect = (service: string) => {
        setSelectedService(service);
        setWizardStep(2);
    };

    const handleTimelineSelect = (timeline: string) => {
        setSelectedTimeline(timeline);
        setWizardStep(3);
    };

    const generateMailto = () => {
        const subject = encodeURIComponent(`New Project Inquiry: ${selectedService}`);
        const body = encodeURIComponent(`Hi Arly,\n\nI am interested in hiring you for a ${selectedService} project.\n\nMy expected timeline is: ${selectedTimeline}.\n\nHere are some details about the project:\n\n[Please describe your project here]\n\nBest regards,\n[Your Name]`);
        return `mailto:guest@tigaempat.com?subject=${subject}&body=${body}`;
    };

    const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
    const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
    const borderMuted = isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/60';
    const bgCard = isDarkMode ? 'bg-zinc-900/40' : 'bg-white/60';

    // FAQ state
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            <main className="relative z-10 flex flex-col items-center min-h-screen px-4 pt-24 pb-16 space-y-32 max-w-6xl mx-auto">

                {/* 1. HERO & WIZARD */}
                <section className="w-full flex flex-col items-center text-center space-y-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md font-semibold text-sm transition-colors"
                        style={{ borderColor: isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)', backgroundColor: isDarkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)', color: isDarkMode ? '#818CF8' : '#4F46E5' }}
                    >
                        <Zap size={16} className="text-amber-400" /> Available for Commission
                    </motion.div>

                    <h1 className={`text-5xl md:text-7xl font-black tracking-tighter ${textPrimary}`}>
                        Let&apos;s Build Something <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-700 to-purple-500">Amazing</span>
                    </h1>
                    <p className={`text-xl md:text-2xl max-w-2xl leading-relaxed ${textSecondary}`}>
                        Robust infrastructure, custom API development, and DevOps automation tailored for scale.
                    </p>

                    {/* INTERACTIVE WIZARD */}
                    <div className={`w-full max-w-2xl mt-12 rounded-[2rem] border backdrop-blur-xl shadow-2xl overflow-hidden transition-colors duration-500 ${bgCard} ${borderMuted}`}>
                        <div className="p-8 md:p-12 min-h-[350px] flex flex-col justify-center relative">
                            <AnimatePresence mode="wait">
                                {wizardStep === 0 && (
                                    <motion.div
                                        key="step0"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col items-center text-center space-y-8 absolute inset-0 justify-center p-8 md:p-12"
                                    >
                                        <div className={`p-6 rounded-3xl border shadow-inner ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-800'}`}>
                                            <Terminal size={48} />
                                        </div>
                                        <h3 className={`text-3xl font-black ${textPrimary}`}>Ready to start a project?</h3>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setWizardStep(1)}
                                            className={`px-10 py-5 rounded-2xl font-bold tracking-wide transition-all ${isDarkMode
                                                ? 'bg-purple-700 text-white hover:bg-purple-600 shadow-[0_0_30px_rgba(126,34,206,0.4)]'
                                                : 'bg-purple-800 text-white hover:bg-purple-900 shadow-xl'
                                                }`}
                                        >
                                            Get a Quote
                                        </motion.button>
                                    </motion.div>
                                )}

                                {wizardStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col space-y-8 absolute inset-0 justify-center p-8 md:p-12"
                                    >
                                        <h3 className={`text-2xl font-black text-center ${textPrimary}`}>What do you need help with?</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {["Backend API", "DevOps & CI/CD", "Database Optimization", "General Consultation"].map((svc) => (
                                                <button
                                                    key={svc}
                                                    onClick={() => handleServiceSelect(svc)}
                                                    className={`p-5 rounded-xl border text-center font-semibold transition-all hover:scale-[1.03] shadow-sm ${isDarkMode
                                                        ? 'bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:border-purple-500/50 hover:text-purple-300 hover:bg-zinc-800'
                                                        : 'bg-white border-zinc-200 text-zinc-700 hover:border-purple-700 hover:text-purple-800 hover:bg-purple-50/40'
                                                        }`}
                                                >
                                                    {svc}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => setWizardStep(0)} className={`text-sm font-medium mx-auto transition-colors ${textSecondary} hover:text-purple-700`}>Cancel</button>
                                    </motion.div>
                                )}

                                {wizardStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col space-y-8 absolute inset-0 justify-center p-8 md:p-12"
                                    >
                                        <h3 className={`text-2xl font-black text-center ${textPrimary}`}>What is your timeline?</h3>
                                        <div className="flex flex-col gap-4">
                                            {["ASAP (Urgent)", "1-2 Months", "Flexible"].map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => handleTimelineSelect(time)}
                                                    className={`p-5 rounded-xl border text-center font-semibold transition-all hover:scale-[1.02] shadow-sm ${isDarkMode
                                                        ? 'bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:border-purple-500/50 hover:text-purple-300 hover:bg-zinc-800'
                                                        : 'bg-white border-zinc-200 text-zinc-700 hover:border-purple-700 hover:text-purple-800 hover:bg-purple-50/40'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => setWizardStep(1)} className={`text-sm font-medium mx-auto transition-colors ${textSecondary} hover:text-purple-700`}>Back</button>
                                    </motion.div>
                                )}

                                {wizardStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col items-center text-center space-y-8 absolute inset-0 justify-center p-8 md:p-12"
                                    >
                                        <div className={`p-5 rounded-full shadow-inner ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <div>
                                            <h3 className={`text-3xl font-black ${textPrimary}`}>Great! Let&apos;s discuss details.</h3>
                                            <p className={`mt-3 font-medium ${textSecondary}`}>I&apos;ve drafted an email based on your selections.</p>
                                        </div>

                                        <motion.a
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={generateMailto()}
                                            className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold tracking-wide transition-all ${isDarkMode
                                                ? 'bg-purple-700 text-white hover:bg-purple-600 shadow-[0_0_30px_rgba(126,34,206,0.4)]'
                                                : 'bg-purple-800 text-white hover:bg-purple-900 shadow-xl'
                                                }`}
                                        >
                                            <Mail size={20} /> Open Email Client
                                        </motion.a>
                                        <button onClick={() => setWizardStep(0)} className={`text-sm font-medium mx-auto transition-colors ${textSecondary} hover:text-purple-700`}>Start Over</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* 2. SERVICES BENTO BOX */}
                <section className="w-full">
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${textPrimary}`}>My Expertise</h2>
                        <div className={`h-1 w-20 mt-6 mx-auto rounded-full ${isDarkMode ? 'bg-purple-500/60' : 'bg-purple-700/40'}`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map((svc, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -8 }}
                                className={`p-8 md:p-10 rounded-[2.5rem] border backdrop-blur-md flex flex-col gap-6 group transition-colors duration-500 ${isDarkMode
                                    ? 'bg-zinc-900/40 border-zinc-800/60 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10'
                                    : 'bg-white/75 border-zinc-200/80 hover:border-purple-700/40 hover:bg-white hover:shadow-2xl'
                                    }`}
                            >
                                <div className={`p-5 rounded-2xl border w-fit transition-colors duration-500 ${isDarkMode
                                    ? 'bg-zinc-800/50 border-zinc-700 text-purple-400 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 group-hover:text-purple-300'
                                    : 'bg-zinc-100 border-zinc-200 text-purple-800 group-hover:bg-purple-50 group-hover:border-purple-200 group-hover:text-purple-900'
                                    }`}>
                                    {svc.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-2xl font-black mb-3 ${textPrimary}`}>{svc.title}</h3>
                                    <p className={`text-base font-medium leading-relaxed ${textSecondary}`}>{svc.desc}</p>
                                </div>
                                <div className="mt-auto pt-6 border-t flex flex-wrap gap-2" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                    {svc.tech.map(t => (
                                        <span key={t} className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${isDarkMode ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                                            }`}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 3. FAQ SECTION */}
                <section className="w-full max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${textPrimary}`}>Frequently Asked Questions</h2>
                        <div className={`h-1 w-20 mt-6 mx-auto rounded-full ${isDarkMode ? 'bg-purple-500/60' : 'bg-purple-700/40'}`} />
                    </div>
                    <div className="flex flex-col gap-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`border rounded-[1.5rem] overflow-hidden backdrop-blur-md transition-colors duration-300 shadow-sm ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900/60' : 'bg-white/60 border-zinc-200/60 hover:bg-white'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-6 md:p-8 flex items-center justify-between gap-6 text-left"
                                >
                                    <span className={`font-bold text-lg md:text-xl ${textPrimary}`}>{faq.question}</span>
                                    <motion.div
                                        animate={{ rotate: openFaq === idx ? 180 : 0 }}
                                        transition={{ duration: 0.3, type: "spring" }}
                                        className={`shrink-0 p-2 rounded-full border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}
                                    >
                                        <ChevronDown size={20} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className={`px-6 md:px-8 pb-8 pt-0 text-base md:text-lg leading-relaxed font-medium ${textSecondary}`}>
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* ═══════════════════════ FOOTER ═══════════════════════ */}
            <footer className={`w-full py-12 px-4 border-t ${isDarkMode ? 'border-zinc-900/50' : 'border-zinc-200/60'} relative z-10`}>
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                    <motion.button
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
        </>
    );
}
