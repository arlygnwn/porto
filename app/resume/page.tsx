import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { fetchAndProcessPortfolioData } from '@/utils/portfolio';
import ResumeView from './ResumeView';

export const metadata: Metadata = {
    title: "arly_cv",
    description: "Downloadable real-time, ATS-optimized Curriculum Vitae and technical resume for Arly - Backend Developer & Systems Specialist.",
};

export const revalidate = false;

export default async function ResumePage() {
    const targetUuid = process.env.NEXT_PUBLIC_USER_UUID;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    let initialProfile: any = null;
    let initialExperiences: any[] = [];
    let initialEducations: any[] = [];
    let initialProjectLibrary: any[] = [];
    let initialSkills: any[] = [];

    if (targetUuid && supabaseUrl && supabaseKey) {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);

            // Fetch with a 3.5s timeout safeguard so the page never hangs if Supabase is slow
            const fetchPromise = fetchAndProcessPortfolioData(supabase, targetUuid);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Supabase fetch timed out (3.5s)")), 3500)
            );

            const processed: any = await Promise.race([fetchPromise, timeoutPromise]);

            initialProfile = processed.myProfile;
            initialExperiences = processed.experiences;
            initialEducations = processed.educations;
            initialProjectLibrary = processed.projectLibrary;
            initialSkills = processed.skills;

        } catch (err) {
            console.error("Resume server compilation fault:", err);
        }
    }

    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-zinc-100 text-zinc-500 font-sans text-sm tracking-wide animate-pulse">
                Compiling Resume...
            </div>
        }>
            <ResumeView
                initialProfile={initialProfile}
                initialExperiences={initialExperiences}
                initialEducations={initialEducations}
                initialProjectLibrary={initialProjectLibrary}
                initialSkills={initialSkills}
            />
        </Suspense>
    );
}
