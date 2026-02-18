import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'assessments.json');

export interface Assessment {
    id: string;
    candidateName: string;
    role: string;
    date: string;
    score: number;
    status: 'passed' | 'review' | 'flagged';
    alerts: string[];
    evidence: { timestamp: string, image: string, reason: string }[];
    lastEvent: string;
}

export async function getAssessments(): Promise<Assessment[]> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array and create initial file
        return [];
    }
}

export async function saveAssessment(assessment: Assessment): Promise<void> {
    const assessments = await getAssessments();
    const index = assessments.findIndex(a => a.id === assessment.id);

    if (index !== -1) {
        assessments[index] = assessment;
    } else {
        assessments.push(assessment);
    }

    await fs.writeFile(DB_PATH, JSON.stringify(assessments, null, 2), 'utf-8');
}

export async function initDb() {
    try {
        await fs.access(DB_PATH);
    } catch {
        const initialData: Assessment[] = [
            { id: '1', candidateName: 'Alex Rivera', role: 'Senior React Dev', date: '2026-02-18', score: 98, status: 'passed', alerts: [], evidence: [], lastEvent: 'Session completed' },
            { id: '2', candidateName: 'Jordan Smith', role: 'Fullstack Engineer', date: '2026-02-18', score: 94, status: 'passed', alerts: [], evidence: [], lastEvent: 'Session completed' },
            { id: '3', candidateName: 'Maria Garcia', role: 'Backend Engineer', date: '2026-02-17', score: 62, status: 'flagged', alerts: ['[14:30] Tab Switch Detected', '[14:35] Large Paste Detected'], evidence: [], lastEvent: 'Flagged for multiple violations' },
        ];
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
        await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    }
}
