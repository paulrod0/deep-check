'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

interface Candidate {
    id: string;
    name: string;
    role: string;
    date: string;
    score: number;
    status: 'passed' | 'review' | 'flagged';
}

export default function DashboardPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await fetch('/api/assessments')
                const data = await res.json()
                setCandidates(data.map((a: any) => ({
                    id: a.id,
                    name: a.candidateName,
                    role: a.role,
                    date: a.date,
                    score: a.score,
                    status: a.status
                })))
            } catch (error) {
                console.error('Failed to fetch assessments:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAssessments()
    }, [])

    const avgTrustScore = candidates.length
        ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)
        : 0

    const flaggedCount = candidates.filter(c => c.status === 'flagged').length

    return (
        <>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1>Security <span className="text-gradient">Intelligence</span></h1>
                    <div className={styles.user}>Admin Portal v2.6</div>
                </header>

                {/* Persistence Warning for Netlify */}
                <div style={{ background: 'rgba(52, 152, 219, 0.05)', border: '1px solid var(--color-primary)', padding: '16px', borderRadius: '12px', marginBottom: '32px', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                    <strong>🚀 Deployment Ready:</strong> This app is optimized for Netlify.
                    <span style={{ opacity: 0.8, marginLeft: '8px' }}>
                        Note: The current local JSON database is ephemeral on serverless platforms. For persistent production data, we recommend migrating to
                        <a href="/brain/391f850a-8da5-4153-b04c-9255e1dc3c69/cloud_scaling_roadmap.md" style={{ color: 'inherit', textDecoration: 'underline', marginLeft: '4px' }}>Supabase or AWS PostgreSql</a>.
                    </span>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Verified</span>
                        <span className={styles.statValue}>{isLoading ? '...' : candidates.length}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Avg. Trust Score</span>
                        <span className={styles.statValue}>{isLoading ? '...' : `${avgTrustScore}%`}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel + ' ' + styles.warning}>Flagged Sessions</span>
                        <span className={styles.statValue}>{isLoading ? '...' : flaggedCount}</span>
                    </div>
                </div>

                {/* Candidate List */}
                <section className={styles.tableSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Recent Assessments</h2>
                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Export CSV</button>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Role</th>
                                    <th>Date</th>
                                    <th>Trust Score</th>
                                    <th>Verification</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map(candidate => (
                                    <tr key={candidate.id}>
                                        <td>
                                            <div className={styles.candidateName}>{candidate.name}</div>
                                            <div className={styles.candidateId}>ID: {candidate.id}</div>
                                        </td>
                                        <td>{candidate.role}</td>
                                        <td>{candidate.date}</td>
                                        <td>
                                            <div className={styles.scoreWrapper}>
                                                <div className={styles.scoreBar}>
                                                    <div className={styles.scoreFill} style={{ width: `${candidate.score}%`, backgroundColor: candidate.score > 85 ? 'var(--color-primary)' : candidate.score > 70 ? '#ffd700' : '#ff4d4d' }}></div>
                                                </div>
                                                <span className={styles.scoreText}>{candidate.score}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[candidate.status]}`}>
                                                {candidate.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/dashboard/reports/${candidate.id}`} className={styles.linkBtn}>View Report</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}
