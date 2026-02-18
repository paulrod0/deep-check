import { NextRequest, NextResponse } from 'next/server';
import { getAssessments, saveAssessment, initDb, Assessment } from '@/lib/db';

export async function GET() {
    await initDb();
    const assessments = await getAssessments();
    return NextResponse.json(assessments);
}

export async function POST(req: NextRequest) {
    await initDb();
    try {
        const assessment: Assessment = await req.json();
        await saveAssessment(assessment);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }
}
