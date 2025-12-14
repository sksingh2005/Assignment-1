import { NextResponse } from 'next/server';
import { saveSubmission } from '@/lib/store';
import { generateAIAnalysis } from '@/lib/llm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { rating, review } = body;

        if (!rating || !review) {
            return NextResponse.json({ error: 'Rating and review are required' }, { status: 400 });
        }

        const aiResponse = await generateAIAnalysis(review, rating);

        const submission = {
            id: uuidv4(),
            rating,
            review,
            timestamp: new Date().toISOString(),
            aiResponse
        };

        saveSubmission(submission);

        return NextResponse.json(submission);
    } catch (error) {
        console.error("Submit Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
