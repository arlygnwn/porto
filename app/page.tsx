import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { fetchAndProcessPortfolioData } from '@/utils/portfolio';
import PortfolioLanding from './PortfolioLanding';

export const metadata: Metadata = {
    title: "Arly | Home",
};

export const revalidate = false;

export default async function Page() {
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

            // Fetch with a 3.5s timeout so the page never hangs if Supabase is slow/unreachable
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
            console.error("Server-side data compilation fault:", err);
        }
    }

    return (
        <PortfolioLanding
            initialProfile={initialProfile}
            initialExperiences={initialExperiences}
            initialEducations={initialEducations}
            initialProjectLibrary={initialProjectLibrary}
            initialSkills={initialSkills}
        />
    );
}