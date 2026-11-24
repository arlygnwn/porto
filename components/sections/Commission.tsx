import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Mail, ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Commission({ isDarkMode }: { isDarkMode: boolean }) {
    return (
        <section id="commission" className="w-full min-h-screen flex flex-col justify-center px-4 pt-24 pb-16 relative overflow-hidden">
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/4 w-120 h-120 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
                <ScrollReveal>
                    <div className={`w-full p-8 md:p-12 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl text-center transition-[border-color,box-shadow] duration-500 hover:shadow-2xl ${
                        isDarkMode ? 'bg-zinc-900/40 border-zinc-800/60 hover:border-purple-500/30' : 'bg-white/75 border-zinc-200/80 hover:border-purple-700/30'
                    }`}>
                        <div className="flex justify-center mb-6">
                            <motion.div 
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-800'}`}
                            >
                                <Palette size={40} />
                            </motion.div>
                        </div>
                        
                        <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                            Commissions
                        </h2>
                        
                        <p className={`text-lg font-medium leading-relaxed mb-8 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            I am currently accepting freelance projects and commissions. Whether you need robust backend infrastructure, custom API development, or DevOps automation, let's build something amazing together.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="mailto:guest@tigaempat.com" 
                                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all ${
                                    isDarkMode 
                                    ? 'bg-purple-700 text-white hover:bg-purple-600 shadow-[0_0_20px_rgba(126,34,206,0.3)]' 
                                    : 'bg-purple-800 text-white hover:bg-purple-900 shadow-md'
                                }`}
                            >
                                <Mail size={18} />
                                <span>Contact Me</span>
                            </motion.a>
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="#project"
                                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border font-bold tracking-wide transition-all ${
                                    isDarkMode 
                                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' 
                                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                                }`}
                            >
                                <span>View My Work</span>
                                <ArrowRight size={18} />
                            </motion.a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
