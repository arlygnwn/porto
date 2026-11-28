"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    ExternalLink, 
    CheckCircle2, 
    Sparkles, 
    Globe, 
    ZoomIn, 
    ZoomOut, 
    Download, 
    FileText
} from 'lucide-react';
import { formatDatePeriod } from '@/utils/date';

function GithubIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

function parseDescriptionLines(text: unknown): { leadIn: string | null; bullets: string[] } {
    if (typeof text !== 'string') return { leadIn: null, bullets: [] };
    const rawLines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (rawLines.length === 0) return { leadIn: null, bullets: [] };

    const stripBullet = (line: string) => {
        if (/^[•●▪◦‣]/.test(line)) return line.replace(/^[•●▪◦‣]+\s*/, '').trim();
        return line.replace(/^[-*]\s+/, '').trim();
    };

    const hasExplicitBullets = rawLines.slice(1).some((line) => /^(?:[•●▪◦‣]|[-*]\s)/.test(line));
    if (rawLines.length > 1 && rawLines[0].endsWith(':') && hasExplicitBullets) {
        return {
            leadIn: rawLines[0],
            bullets: rawLines.slice(1).map(stripBullet).filter(Boolean),
        };
    }

    if (rawLines.length === 1 && (rawLines[0].match(/[•●▪◦‣]/g)?.length ?? 0) >= 2) {
        const splitBullets = rawLines[0]
            .split(/[•●▪◦‣]+/)
            .map((part) => part.trim())
            .filter(Boolean);
        return { leadIn: null, bullets: splitBullets };
    }

    return {
        leadIn: null,
        bullets: rawLines.map(stripBullet).filter(Boolean),
    };
}

function ProjectDescription({ details, textClassName }: { details: unknown; textClassName: string }) {
    const { leadIn, bullets } = parseDescriptionLines(details);

    if (bullets.length === 0 && !leadIn) return null;

    if (bullets.length === 1 && !leadIn && bullets[0] === "No Description") {
        return <p className={`mt-1 leading-relaxed text-justify ${textClassName}`}>{bullets[0]}</p>;
    }

    return (
        <div className={`mt-1 leading-relaxed text-justify ${textClassName}`}>
            {leadIn && <p className="mb-1">{leadIn}</p>}
            {bullets.length > 0 && (
                <ul className="list-disc list-outside pl-4 space-y-0.5">
                    {bullets.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

interface ResumeViewProps {
    initialProfile: Record<string, any> | null;
    initialExperiences: any[];
    initialEducations: any[];
    initialProjectLibrary: any[];
    initialSkills: any[];
}

export default function ResumeView({
    initialProfile,
    initialExperiences,
    initialEducations,
    initialProjectLibrary,
    initialSkills,
}: ResumeViewProps) {
    const [copiedLink, setCopiedLink] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [activeLayout, setActiveLayout] = useState<'gutter' | 'compact'>('gutter');

    // Profile data mapping with fallback defaults
    const profile = initialProfile || {
        name: "Arly",
        job: "Senior Backend Developer & Systems Specialist",
        location: "Indonesia",
        email: "contact@arly.dev",
        no_hp: "+62 812 3456 7890",
        current_status: "Currently on Contract — Accepting Commissions",
        availability: "Open for Commissions / 1 Month Notice for Full-Time Roles",
        link_1: "https://github.com",
        link_2: "https://linkedin.com",
    };

    const safeName = (profile?.name || "full_name").toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
    const pdfFileName = `${safeName}_cv`;

    // Keep browser tab and document title strictly set to full_name_cv
    // This instructs the browser's "Save as PDF" engine to pre-fill the filename as full_name_cv.pdf
    useEffect(() => {
        document.title = pdfFileName;
    }, [pdfFileName]);

    const handleDownloadPdf = () => {
        document.title = pdfFileName;
        window.print();
    };

    const experiences = initialExperiences && initialExperiences.length > 0 ? initialExperiences : [
        {
            role: "Senior Backend Engineer",
            company: "Enterprise Cloud Systems",
            period: "2023 — Present",
            description: "Architected high-throughput microservices and relational database optimizations. Directed migration of legacy monolith to containerized Docker workloads.",
            achievements: [
                "Reduced p99 API response latency by 45% through PostgreSQL query index optimization and Redis multi-tier caching.",
                "Engineered asynchronous worker queue processing 50,000+ daily events with 99.99% message delivery reliability.",
                "Maintained 99.95% production uptime across distributed multi-region cluster deployments."
            ],
            linkedProjects: []
        },
        {
            role: "Backend & Systems Specialist",
            company: "Distributed Tech Solutions",
            period: "2021 — 2023",
            description: "Engineered scalable REST and GraphQL APIs, designed normalized relational database schemas, and managed automated CI/CD deployment pipelines.",
            achievements: [
                "Constructed 25+ production-ready REST & GraphQL endpoints with automated OpenAPI documentation and input validation.",
                "Integrated automated telemetry and structured audit logging via Winston and Prometheus.",
                "Reduced deployment pipeline build times by 35% through multi-stage Docker builds."
            ],
            linkedProjects: []
        }
    ];

    const sortedExperiences = [...experiences].sort((a: any, b: any) => {
        const aTime = a.startDate ? new Date(a.startDate).getTime() : 0;
        const bTime = b.startDate ? new Date(b.startDate).getTime() : 0;
        if (!aTime && !bTime) return 0;
        return bTime - aTime;
    });

    const educations = initialEducations && initialEducations.length > 0 ? initialEducations : [
        {
            institution: "State University of Technology",
            degree: "Bachelor of Science",
            field_of_study: "Computer Science & Informatics",
            start_date: "2017",
            end_date: "2021",
            gpa: "3.85 / 4.00",
            education_desc: "Focused on Distributed Systems, Advanced Database Management, API Architecture, and Network Security."
        }
    ];

    const projects = (initialProjectLibrary && initialProjectLibrary.length > 0 ? initialProjectLibrary : [
        {
            id: "p1",
            name: "High-Performance Real-Time Portfolio Platform",
            company: "Independent Engineering",
            period: "2026",
            details: "Full-stack server-rendered web application with Supabase Postgres Realtime synchronization, Edge runtime compatibility on Cloudflare Workers, and sub-100ms cold start performance.",
            tech: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Tailwind CSS", "Cloudflare Workers"],
            metrics: "Sub-100ms global p95 latency and automated zero-latency database change propagation.",
            experience_id: null,
            repo_url: "https://github.com",
            demo_url: "https://portfolio.example.com"
        },
        {
            id: "p2",
            name: "Distributed Task & Workflow Orchestration Engine",
            company: "Enterprise Cloud Systems",
            period: "2024",
            details: "Constructed asynchronous background worker queue handling 50,000+ jobs daily with Redis Pub/Sub, automated exponential backoff retries, and comprehensive Winston audit telemetry.",
            tech: ["Node.js", "Redis", "PostgreSQL", "Docker", "Winston"],
            metrics: "Processed 50,000+ daily transactions with 99.99% event delivery reliability.",
            experience_id: "exp1",
            repo_url: "https://github.com",
            demo_url: null
        }
    ]).filter((proj: any) => proj.experience_id !== null && proj.experience_id !== undefined);

    // Categorized skills meeting HR Review Depth guidelines
    const rawSkills = initialSkills && initialSkills.length > 0 ? initialSkills.map(s => s.skill_nm) : [
        "Spring Boot", "Java", "Git", "MariaDB", "PostgreSQL", "Docker", "REST API",
        "Redis", "Supabase", "Cloudflare Workers & Edge", "Microservices Architecture", "CI/CD & DevOps", "Linux & Systems"
    ];

    const coreStack = [
        "Spring Boot", "Java", "Git", "MariaDB", "PostgreSQL", "Docker", "REST API"
    ];

    const secondaryStack = rawSkills.filter(s => !coreStack.includes(s));

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 70));
    const handleResetZoom = () => setZoomLevel(100);

    return (
        <div className="min-h-screen bg-zinc-800 text-zinc-900 font-sans print:bg-white print:text-black">
            {/* ═══════════════════════ PDF VIEWER TOP TOOLBAR (NO-PRINT) ═══════════════════════ */}
            <header className="no-print sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-700/80 px-4 py-2.5 shadow-lg text-white">
                <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Left: Navigation & Document Status */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors py-1.5 px-3 rounded-lg border border-zinc-700 hover:border-zinc-500 bg-zinc-800/80"
                        >
                            <ArrowLeft size={13} />
                            <span>Portfolio</span>
                        </Link>

                        <div className="h-4 w-px bg-zinc-700 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-indigo-400" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                                    <span>Curriculum Vitae</span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Viewable PDF</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Layout Format & Zoom Controls */}
                    <div className="flex items-center gap-2">
                        {/* Format Switcher */}
                        <div className="inline-flex rounded-lg border border-zinc-700 p-0.5 bg-zinc-800 text-[11px] font-medium">
                            <button
                                onClick={() => setActiveLayout('gutter')}
                                className={`px-2.5 py-1 rounded-md transition-all ${activeLayout === 'gutter' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'}`}
                            >
                                Executive Gutter
                            </button>
                            <button
                                onClick={() => setActiveLayout('compact')}
                                className={`px-2.5 py-1 rounded-md transition-all ${activeLayout === 'compact' ? 'bg-zinc-700 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'}`}
                            >
                                Compact ATS
                            </button>
                        </div>

                        {/* Zoom Controls */}
                        <div className="hidden md:flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-lg p-0.5 text-xs text-zinc-300">
                            <button onClick={handleZoomOut} className="p-1 hover:text-white rounded hover:bg-zinc-700" title="Zoom Out">
                                <ZoomOut size={13} />
                            </button>
                            <button onClick={handleResetZoom} className="px-1.5 text-[11px] font-mono hover:text-white" title="Reset Zoom">
                                {zoomLevel}%
                            </button>
                            <button onClick={handleZoomIn} className="p-1 hover:text-white rounded hover:bg-zinc-700" title="Zoom In">
                                <ZoomIn size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Right: PDF Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopyLink}
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 py-1.5 px-3 rounded-lg bg-zinc-800 transition-colors"
                            title="Share Link"
                        >
                            {copiedLink ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Globe size={13} />}
                            <span>{copiedLink ? "Copied" : "Share"}</span>
                        </button>

                        {/* Primary Viewable PDF / Print Trigger */}
                        <button
                            onClick={handleDownloadPdf}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 py-1.5 px-4 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            title={`Download ${pdfFileName}.pdf`}
                        >
                            <Download size={13} />
                            <span>Download {pdfFileName}.pdf</span>
                        </button>
                    </div>
                </div>

                {/* Sub-bar Recruiter Metadata */}
                <div className="max-w-6xl mx-auto mt-2 pt-1.5 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1.5">
                        <Sparkles size={11} className="text-indigo-400" />
                        <span>ATS-compliant live resume dynamically compiled from real-time portfolio data.</span>
                    </span>
                    <span className="font-mono text-zinc-500">Page Size: A4 Standard (210 × 297 mm)</span>
                </div>
            </header>

            {/* ═══════════════════════ PDF VIEWER CANVAS BACKGROUND ═══════════════════════ */}
            <div className="py-8 px-2 sm:px-6 flex justify-center overflow-x-auto print:p-0 print:m-0 print:overflow-visible">
                
                {/* ═══════════════════════ PHYSICAL A4 PDF DOCUMENT SHEET ═══════════════════════ */}
                <main 
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="w-full max-w-[210mm] min-h-[297mm] bg-white text-zinc-900 shadow-2xl rounded-sm print:rounded-none print:shadow-none print:m-0 print:max-w-none print:transform-none transition-transform duration-200 p-8 sm:p-12"
                >
                    {/* ──────────────────────────────────────────────────────────
                        EXECUTIVE GUTTER FORMAT (2-COLUMN GUTTER ARCHITECTURE)
                    ────────────────────────────────────────────────────────── */}
                    {activeLayout === 'gutter' ? (
                        <div className="space-y-6 text-[13px] leading-relaxed">
                            
                            {/* CANDIDATE HEADER */}
                            <header className="border-b-2 border-zinc-900 pb-5 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                                            {profile.name || "Candidate Name"}
                                        </h1>
                                        <p className="text-sm sm:text-base font-semibold text-indigo-700 print:text-zinc-800 mt-0.5">
                                            {profile.job || "Senior Backend Developer & Systems Specialist"}
                                        </p>
                                        <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 print:border-none print:p-0 print:bg-transparent">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 print:hidden" />
                                            <span>{profile.current_status || profile.availability || "Currently on Contract — Accepting Commissions"}</span>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-1 text-xs text-zinc-600 print:text-zinc-800 text-left sm:text-right">
                                        {profile.email && (
                                            <div className="flex items-center sm:justify-end gap-1.5">
                                                <Mail size={12} className="text-zinc-400 print:hidden" />
                                                <a href={`mailto:${profile.email}`} className="text-indigo-600 print:text-zinc-800 hover:underline font-medium">
                                                    {profile.email}
                                                </a>
                                            </div>
                                        )}
                                        {profile.no_hp && (
                                            <div className="flex items-center sm:justify-end gap-1.5">
                                                <Phone size={12} className="text-zinc-400 print:hidden" />
                                                <span>{profile.no_hp}</span>
                                            </div>
                                        )}
                                        {profile.location && (
                                            <div className="flex items-center sm:justify-end gap-1.5">
                                                <MapPin size={12} className="text-zinc-400 print:hidden" />
                                                <span>{profile.location}</span>
                                            </div>
                                        )}
                                        {profile.link_1 && (
                                            <div className="flex items-center sm:justify-end gap-1.5">
                                                <GithubIcon size={12} className="text-zinc-400 print:hidden" />
                                                <a href={profile.link_1} target="_blank" rel="noreferrer" className="text-indigo-600 print:text-zinc-800 hover:underline">
                                                    {profile.link_1.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                        {profile.link_2 && (
                                            <div className="flex items-center sm:justify-end gap-1.5">
                                                <Globe size={12} className="text-zinc-400 print:hidden" />
                                                <a href={profile.link_2} target="_blank" rel="noreferrer" className="text-indigo-600 print:text-zinc-800 hover:underline">
                                                    {profile.link_2.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </header>

                            {/* 1. EXECUTIVE SUMMARY */}
                            <section className="print-break-inside-avoid">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 border-b border-zinc-200 pb-5">
                                    <div className="md:col-span-4">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                            Executive Summary
                                        </h2>
                                    </div>
                                    <div className="md:col-span-8">
                                        <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed text-justify">
                                            Results-driven Backend Developer specialized in clean server-side architecture, high-throughput microservices, and database tuning. Proven experience building fault-tolerant APIs, asynchronous worker queues, and zero-downtime CI/CD container pipelines. Dedicated to writing verifiable, maintainable code with high production reliability and sub-100ms response times.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 2. CORE COMPETENCIES & TECHNICAL STACK */}
                            <section className="print-break-inside-avoid">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 border-b border-zinc-200 pb-5">
                                    <div className="md:col-span-4">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                            Core Technologies
                                        </h2>
                                        <p className="text-[11px] text-zinc-500 mt-0.5">Categorized by production depth</p>
                                    </div>
                                    <div className="md:col-span-8 space-y-3">
                                        {/* Primary Core Stack */}
                                        <div>
                                            <span className="text-xs font-bold text-zinc-900 block mb-1">
                                                Primary Drivers (Daily Production):
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {coreStack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200 print:bg-white print:border-zinc-300"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Secondary / Infrastructure */}
                                        {secondaryStack.length > 0 && (
                                            <div>
                                                <span className="text-xs font-bold text-zinc-900 block mb-1">
                                                    Systems, Cloud &amp; Infrastructure:
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {secondaryStack.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 print:bg-white"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* 3. PROFESSIONAL WORK EXPERIENCE */}
                            <section>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 border-b border-zinc-200 pb-5">
                                    <div className="md:col-span-4">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                            Work Experience
                                        </h2>
                                    </div>
                                    <div className="md:col-span-8 space-y-5">
                                        {sortedExperiences.map((exp: any, idx: number) => (
                                            <div key={idx} className="print-break-inside-avoid">
                                                <div className="text-xs font-mono font-semibold text-indigo-700 print:text-zinc-800">
                                                    {exp.period}
                                                </div>
                                                <div className="text-sm font-bold text-zinc-900 mt-0.5">
                                                    {exp.role}
                                                </div>
                                                <div className="text-xs font-semibold text-zinc-600">
                                                    {exp.company}
                                                </div>
                                                <p className="mt-1.5 text-xs text-zinc-700 leading-relaxed text-justify">
                                                    {exp.description}
                                                </p>

                                                {/* Key Quantifiable Achievements */}
                                                {exp.achievements && exp.achievements.length > 0 && (
                                                    <div className="mt-2 pt-1">
                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 block mb-1">
                                                            Key Accomplishments:
                                                        </span>
                                                        <ul className="list-disc list-inside space-y-1 text-xs text-zinc-700 text-justify">
                                                            {exp.achievements.map((item: string, i: number) => (
                                                                <li key={i} className="leading-relaxed">
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* 4. FEATURED ENGINEERING PROJECTS & IMPACT METRICS */}
                            <section>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 border-b border-zinc-200 pb-5">
                                    <div className="md:col-span-4">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                            Projects &amp; Impact
                                        </h2>
                                        <p className="text-[11px] text-zinc-500 mt-0.5">Verifiable code &amp; metrics</p>
                                    </div>
                                    <div className="md:col-span-8 space-y-4">
                                        {projects.slice(0, 4).map((proj: any) => (
                                            <div key={proj.id} className="print-break-inside-avoid border-l-2 border-indigo-300 pl-3 py-0.5 print:border-zinc-400">
                                                <div className="flex items-baseline justify-between gap-1">
                                                    <div className="text-xs font-bold text-zinc-900">
                                                        {proj.name}
                                                    </div>
                                                    <span className="text-[11px] font-mono text-zinc-500">{proj.period}</span>
                                                </div>

                                                <ProjectDescription details={proj.details} textClassName="text-xs text-zinc-700" />

                                                {/* Measurable Business & Engineering Impact */}
                                                {proj.metrics && (
                                                    <div className="mt-1 text-xs text-emerald-900 font-semibold bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/60 print:bg-transparent print:border-none print:p-0">
                                                        <span>Impact: </span>
                                                        <span>{proj.metrics}</span>
                                                    </div>
                                                )}

                                                {/* Stack & Verification Links */}
                                                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                                    <div className="text-zinc-600">
                                                        <span className="font-semibold text-zinc-800">Technologies: </span>
                                                        <span>{Array.isArray(proj.tech) ? proj.tech.join(" • ") : proj.tech}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3 print:hidden">
                                                        {proj.repo_url && (
                                                            <a 
                                                                href={proj.repo_url} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
                                                            >
                                                                <GithubIcon size={11} />
                                                                <span>Source Code</span>
                                                            </a>
                                                        )}
                                                        {proj.demo_url && (
                                                            <a 
                                                                href={proj.demo_url} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
                                                            >
                                                                <ExternalLink size={11} />
                                                                <span>Live Demo</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* 5. EDUCATION & CREDENTIALS */}
                            <section className="print-break-inside-avoid">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 border-b border-zinc-200 pb-5">
                                    <div className="md:col-span-4">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                            Education &amp; Credentials
                                        </h2>
                                    </div>
                                    <div className="md:col-span-8 space-y-4">
                                        {educations.map((edu: any, idx: number) => (
                                            <div key={idx}>
                                                <div className="text-xs font-mono font-semibold text-indigo-700 print:text-zinc-800">
                                                    {formatDatePeriod(edu.start_date)} — {formatDatePeriod(edu.end_date)}
                                                </div>
                                                <div className="text-sm font-bold text-zinc-900 mt-0.5">
                                                    {edu.degree} in {edu.field_of_study}
                                                </div>
                                                <div className="text-xs font-semibold text-zinc-700">
                                                    {edu.institution}
                                                </div>
                                                {edu.gpa && (
                                                    <div className="text-xs text-zinc-700 mt-0.5">
                                                        <span className="font-semibold text-zinc-800">Cumulative GPA: </span>
                                                        {edu.gpa}
                                                    </div>
                                                )}
                                                {edu.education_desc && (
                                                    <div className="text-xs text-zinc-600 mt-1 text-justify">
                                                        <span className="font-semibold text-zinc-800">Key Coursework: </span>
                                                        {edu.education_desc}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* 6. WORK MOBILITY & REFERENCES */}
                            <section className="print-break-inside-avoid">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
                                    <div className="md:col-span-4">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                            Work Status &amp; References
                                        </h2>
                                    </div>
                                    <div className="md:col-span-8 space-y-1.5 text-xs text-zinc-700">
                                        <div>
                                            <span className="font-semibold text-zinc-900">Current Status: </span>
                                            <span>{profile.current_status || "Currently on Contract — Accepting Commissions"}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-zinc-900">Availability: </span>
                                            <span>{profile.availability || "Open for Commissions / 1 Month Notice for Full-Time Roles"}</span>
                                        </div>
                                        <div className="text-justify">
                                            <span className="font-semibold text-zinc-900">References: </span>
                                            <span>Professional references available upon request. Only select public code repositories are available on GitHub (not all project source code is publicly available due to client/NDA restrictions).</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    ) : (
                        /* ──────────────────────────────────────────────────────────
                            COMPACT ATS FORMAT
                        ────────────────────────────────────────────────────────── */
                        <div className="space-y-6 text-[13px] leading-relaxed">
                            {/* CANDIDATE HEADER */}
                            <section className="border-b border-zinc-200 pb-5">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                                            {profile.name || "Candidate Name"}
                                        </h1>
                                        <p className="text-base font-semibold text-indigo-700 print:text-zinc-700 mt-1">
                                            {profile.job || "Backend Developer & Systems Specialist"}
                                        </p>
                                        <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 print:border-none print:p-0 print:text-zinc-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 print:hidden" />
                                            <span>{profile.current_status || profile.availability || "Currently on Contract — Accepting Commissions"}</span>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="text-xs space-y-1 text-zinc-600 text-left sm:text-right">
                                        {profile.email && <div><a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a></div>}
                                        {profile.no_hp && <div>{profile.no_hp}</div>}
                                        {profile.location && <div>{profile.location}</div>}
                                        {profile.link_1 && <div><a href={profile.link_1} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{profile.link_1.replace(/^https?:\/\//, '')}</a></div>}
                                    </div>
                                </div>
                            </section>

                            {/* PROFESSIONAL SUMMARY */}
                            <section className="print-break-inside-avoid">
                                <h2 className="text-xs font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-1 mb-2">
                                    Professional Summary
                                </h2>
                                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed text-justify">
                                    Results-driven Backend Developer specialized in designing clean, scalable server-side solutions, high-performance API architectures, and resilient distributed systems. Experienced in relational database optimization with PostgreSQL, low-latency asynchronous worker pipelines, and modern DevOps containerization.
                                </p>
                            </section>

                            {/* CORE COMPETENCIES */}
                            <section className="print-break-inside-avoid">
                                <h2 className="text-xs font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-1 mb-2">
                                    Core Technologies
                                </h2>
                                <div className="space-y-2 pt-1">
                                    <div>
                                        <span className="text-xs font-bold text-zinc-900 block mb-1">Core Drivers:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {coreStack.map((tech) => (
                                                <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {secondaryStack.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-zinc-900 block mb-1">Infrastructure &amp; Systems:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {secondaryStack.map((tech) => (
                                                    <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* WORK EXPERIENCE */}
                            <section>
                                <h2 className="text-xs font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-1 mb-3">
                                    Professional Experience
                                </h2>
                                <div className="space-y-4">
                                    {sortedExperiences.map((exp: any, idx: number) => (
                                        <div key={idx} className="print-break-inside-avoid">
                                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                                <div>
                                                    <h3 className="text-sm font-bold text-zinc-900">{exp.role}</h3>
                                                    <p className="text-xs font-semibold text-indigo-700">{exp.company}</p>
                                                </div>
                                                <span className="text-xs font-mono text-zinc-500">{exp.period}</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-zinc-700 mt-1 leading-relaxed text-justify">
                                                {exp.description}
                                            </p>
                                            {exp.achievements && (
                                                <ul className="list-disc list-inside mt-1.5 text-xs text-zinc-700 space-y-0.5 text-justify">
                                                    {exp.achievements.map((item: string, i: number) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* FEATURED PROJECTS */}
                            <section>
                                <h2 className="text-xs font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-1 mb-3">
                                    Featured Projects &amp; Impact
                                </h2>
                                <div className="space-y-4">
                                    {projects.slice(0, 4).map((proj: any) => (
                                        <div key={proj.id} className="print-break-inside-avoid border-l-2 border-indigo-200 pl-3 py-0.5">
                                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                                <h3 className="text-sm font-bold text-zinc-900">{proj.name}</h3>
                                                <span className="text-xs font-mono text-zinc-500">{proj.period}</span>
                                            </div>
                                            <ProjectDescription details={proj.details} textClassName="text-xs sm:text-sm text-zinc-700" />
                                            {proj.metrics && (
                                                <div className="mt-1 text-xs text-emerald-800 font-semibold">
                                                    Impact: {proj.metrics}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* EDUCATION */}
                            <section className="print-break-inside-avoid">
                                <h2 className="text-xs font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-1 mb-3">
                                    Education &amp; Credentials
                                </h2>
                                <div className="space-y-3">
                                    {educations.map((edu: any, idx: number) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-bold text-zinc-900">{edu.degree} in {edu.field_of_study}</h3>
                                                <span className="text-xs font-mono text-zinc-500">{formatDatePeriod(edu.start_date)} — {formatDatePeriod(edu.end_date)}</span>
                                            </div>
                                            <p className="text-xs font-semibold text-indigo-700">{edu.institution}</p>
                                            {edu.gpa && <p className="text-xs text-zinc-600 mt-0.5">GPA: {edu.gpa}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>

            {/* Print and A4 Layout Styles Injection */}
            <style jsx global>{`
                @media print {
                    html, body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        scroll-snap-type: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-break-inside-avoid {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    @page {
                        size: A4;
                        margin: 12mm 15mm;
                    }
                    main {
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        max-width: 100% !important;
                        transform: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
