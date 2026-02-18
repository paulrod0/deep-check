import { NextRequest, NextResponse } from 'next/server';
import { getAssessments, initDb } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await initDb();
    const solvedParams = await params;
    const assessments = await getAssessments();
    const assessment = assessments.find((a) => a.id === solvedParams.id);

    if (!assessment) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(assessment);
}
