
import { createClient } from '@supabase/supabase-js';
import { Submission } from '@/types';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const dataDir = path.join(process.cwd(), 'src', 'data');
const dataFile = path.join(dataDir, 'submissions.json');

// Ensure data directory exists for local fallback
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export async function getSubmissions(): Promise<Submission[]> {
    if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            return [];
        }

        // Map database columns to our interface if diff, but assuming 1:1 for now
        // We store aiResponse as jsonb in DB, so it should map correctly
        return data as Submission[];
    } else {
        // Fallback to local
        if (!fs.existsSync(dataFile)) {
            return [];
        }
        const fileContent = fs.readFileSync(dataFile, 'utf-8');
        try {
            return JSON.parse(fileContent);
        } catch (error) {
            console.error("Error parsing submissions data:", error);
            return [];
        }
    }
}

export async function saveSubmission(submission: Submission): Promise<void> {
    let success = false;

    if (supabaseUrl && supabaseKey) {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { error } = await supabase
                .from('feedback')
                .insert([submission]);

            if (error) {
                console.warn("Supabase save failed (using local storage fallback):", error.message);
                // Fallthrough to local
            } else {
                success = true;
            }
        } catch (err) {
            console.warn("Supabase connection exception:", err);
        }
    }

    if (!success) {
        console.log("Falling back to local storage.");
        // Fallback to local
        let submissions: Submission[] = [];
        if (fs.existsSync(dataFile)) {
            try {
                submissions = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
            } catch (e) {
                submissions = [];
            }
        }
        submissions.unshift(submission);
        fs.writeFileSync(dataFile, JSON.stringify(submissions, null, 2));
    }
}
