import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/store';

export async function GET() {
    try {
        const submissions = await getSubmissions();
        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
