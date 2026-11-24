import { formatDatePeriod } from './date';

interface RawPortfolioData {
    profileData: any;
    eduData: any[] | null;
    expData: any[] | null;
    rawProjData: any[] | null;
    skillsData: any[] | null;
    pSkillsData: any[] | null;
}

/**
 * Transforms raw relational database data from Supabase into nested structures
 * suitable for the UI components. It links projects to experiences and educations,
 * maps skill names to project-skills, and formats dates.
 */
export function processPortfolioData({
    profileData,
    eduData,
    expData,
    rawProjData,
    skillsData,
    pSkillsData
}: RawPortfolioData) {
    let processedProjects: any[] = [];
    
    // Create a map of skill ID -> Skill Name for fast O(1) lookups
    const skillsMap = new Map(skillsData?.map(s => [s.id, s.skill_nm]));

    if (rawProjData) {
        // Filter out any projects linked to another user's experience or education
        const scopedProjects = rawProjData.filter((proj) => {
            if (proj.experience_id) {
                return expData?.some(e => e.id === proj.experience_id);
            }
            if (proj.education_id) {
                return eduData?.some(e => e.id === proj.education_id);
            }
            // Standalone project: only include if not belonging to other experiences/educations
            return true;
        });

        processedProjects = scopedProjects.map((proj) => {
            // Determine if this project is linked to an Experience or Education record
            const linkedExp = proj.experience_id && expData?.find(e => e.id === proj.experience_id);
            const linkedEdu = !linkedExp && proj.education_id && eduData?.find(e => e.id === proj.education_id);

            const companyName = linkedExp ? linkedExp.company_nm : (linkedEdu ? linkedEdu.institution : "Independent Project");
            
            // Format the active period of the project
            const computedPeriod = linkedExp
                ? `${formatDatePeriod(linkedExp.start_date)} — ${formatDatePeriod(linkedExp.end_date)}`
                : (linkedEdu
                    ? `${formatDatePeriod(linkedEdu.start_date)} — ${formatDatePeriod(linkedEdu.end_date)}`
                    : formatDatePeriod(proj.standalone_date));

            // Determine date for sorting
            const dateForSort = linkedExp ? linkedExp.start_date : (linkedEdu ? linkedEdu.start_date : proj.standalone_date);

            // Fetch and attach skills used in this specific project
            const linkedSkills = pSkillsData
                ? pSkillsData
                    .filter((ps) => ps.project_id === proj.id)
                    .map((ps) => skillsMap.get(ps.skill_id))
                    .filter(Boolean)
                : [];

            return {
                id: proj.id,
                name: proj.project_nm || "Untitled Project",
                company: companyName,
                period: computedPeriod,
                details: proj.project_desc || "No Description",
                tech: linkedSkills.length > 0 ? linkedSkills : ["No Skill Added"],
                experience_id: proj.experience_id || null,
                education_id: proj.education_id || null,
                repo_url: proj.repo_url || null,
                demo_url: proj.demo_url || null,
                metrics: proj.metrics || proj.impact || null,
                _dateForSort: dateForSort
            };
        });

        // Sort projects by newest first
        processedProjects.sort((a, b) => {
            if (!a._dateForSort) return 1;
            if (!b._dateForSort) return -1;
            return new Date(b._dateForSort).getTime() - new Date(a._dateForSort).getTime();
        });
    }

    let parsedExperiences: any[] = [];
    if (expData) {
        parsedExperiences = expData.map(exp => ({
            startDate: exp.start_date,
            endDate: exp.end_date,
            period: `${formatDatePeriod(exp.start_date)} — ${formatDatePeriod(exp.end_date)}`,
            role: exp.job_nm,
            company: exp.company_nm,
            description: exp.job_desc,
            // Attach IDs of projects that belong to this experience
            linkedProjects: processedProjects
                .filter(p => p.experience_id === exp.id)
                .map(p => p.id)
        }));
    }

    let parsedEducations: any[] = [];
    if (eduData) {
        parsedEducations = eduData.map(edu => ({
            ...edu,
            // Attach IDs of projects that belong to this education
            linkedProjects: processedProjects
                .filter(p => p.education_id === edu.id)
                .map(p => p.id)
        }));
    }

    return {
        myProfile: profileData,
        experiences: parsedExperiences,
        educations: parsedEducations,
        projectLibrary: processedProjects,
        skills: skillsData || []
    };
}

/**
 * Centralized data fetching layer. 
 * Fetches all necessary portfolio data in parallel via Supabase and processes it.
 * This is fully compatible with Edge Runtimes (e.g. Cloudflare Pages).
 * 
 * @param supabase An initialized Supabase client
 * @param targetUuid The UUID of the user to fetch data for
 * @returns Processed portfolio data for the UI
 */
export async function fetchAndProcessPortfolioData(supabase: any, targetUuid: string) {
    const [
        { data: profileData, error: profileErr },
        { data: eduData, error: eduErr },
        { data: expData, error: expErr },
        { data: rawProjData, error: projErr },
        { data: skillsData, error: skillsErr },
        { data: pSkillsData, error: pSkillsErr }
    ] = await Promise.all([
        supabase.from('profiles').select('id, name, job, location, email, no_hp, description, prof_pic, current_status, availability, link_1, link_2, link_3, social_1, social_2, social_3').eq('id', targetUuid).single(),
        supabase.from('educations').select('id, profile_id, start_date, end_date, institution, degree, field_of_study, gpa, education_desc').eq('profile_id', targetUuid).order('start_date', { ascending: false }),
        supabase.from('experiences').select('id, profile_id, start_date, end_date, company_nm, job_nm, job_desc').eq('profile_id', targetUuid).order('start_date', { ascending: true }),
        supabase.from('projects').select('id, experience_id, education_id, project_nm, project_desc, standalone_date'),
        supabase.from('skills').select('id, skill_nm, icon_url, services'),
        supabase.from('project_skills').select('project_id, skill_id')
    ]);

    // Handle Fetch Errors
    if (profileErr) { console.error('Profile Error:', profileErr); throw profileErr; }
    if (eduErr) { console.error('Edu Error:', eduErr); throw eduErr; }
    if (expErr) { console.error('Exp Error:', expErr); throw expErr; }
    if (projErr) { console.error('Proj Error:', projErr); throw projErr; }
    if (skillsErr) { console.error('Skills Error:', skillsErr); throw skillsErr; }
    if (pSkillsErr) { console.error('Project Skills Error:', pSkillsErr); throw pSkillsErr; }
    if (!profileData) throw new Error("No profile data found");

    return processPortfolioData({
        profileData,
        eduData,
        expData,
        rawProjData,
        skillsData,
        pSkillsData
    });
}

