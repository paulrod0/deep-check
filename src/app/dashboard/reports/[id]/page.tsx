'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../../page.module.css'

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const [assessment, setAssessment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/assessments/${id}`)
                if (!res.ok) throw new Error('Not found')
                const data = await res.json()
                setAssessment(data)
            } catch (err) {
                console.error(err)
                router.push('/dashboard')
            } finally {
                setIsLoading(false)
            }
        }
        fetchReport()
    }, [id, router])

    if (isLoading) return <div className={styles.content}>Loading report...</div>
    if (!assessment) return null

    return (
        <div className={styles.content}>
            <header className={styles.header}>
                <div>
                    <Link href="/dashboard" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.8rem', marginBottom: '8px', display: 'block' }}>← Back to Dashboard</Link>
                    <h1>Session <span className="text-gradient">Report</span></h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>VERIFICATION ID</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{assessment.id}</div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Main Info Card */}
                    <section className={styles.tableSection} style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{assessment.candidateName}</h2>
                                <p style={{ color: 'var(--color-text-muted)' }}>{assessment.role} • {assessment.date}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className={`${styles.statusBadge} ${styles[assessment.status]}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                                    {assessment.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '32px' }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Identity Verification</div>
                                <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>PASSED</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Liveness Check</div>
                                <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>SECURE</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Focus Retention</div>
                                <div style={{ color: assessment.score > 80 ? 'var(--color-primary)' : '#ff4d4d', fontWeight: 600 }}>
                                    {assessment.score > 80 ? 'HIGH' : 'LOW'}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Alert Timeline */}
                    <section className={styles.tableSection} style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Incident Timeline</h3>
                        {assessment.alerts?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {assessment.alerts.map((alert: string, i: number) => (
                                    <div key={i} style={{ padding: '16px', background: 'rgba(255, 77, 77, 0.05)', borderLeft: '4px solid #ff4d4d', borderRadius: '4px', fontSize: '0.9rem' }}>
                                        {alert}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ opacity: 0.5 }}>No suspicious incidents recorded during this session.</p>
                        )}
                    </section>

                    {/* Forensic Evidence Gallery */}
                    {assessment.evidence?.length > 0 && (
                        <section className={styles.tableSection} style={{ padding: '32px' }}>
                            <h3 style={{ marginBottom: '24px' }}>Forensic Evidence Gallery</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                {assessment.evidence.map((item: any, i: number) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '8px', marginBottom: '12px' }}>
                                            <img src={item.image} alt={item.reason} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                                {item.timestamp}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ff4d4d' }}>{item.reason}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className={styles.statCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
                        <span className={styles.statLabel} style={{ marginBottom: '16px' }}>Integrity Score</span>
                        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#222" strokeWidth="2" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray={`${assessment.score}, 100`} />
                            </svg>
                            <span style={{ position: 'absolute', fontSize: '1.8rem', fontWeight: 800 }}>{assessment.score}%</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <h4 style={{ marginBottom: '16px', fontSize: '0.9rem' }}>Security Actions</h4>
                        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>Approve Candidate</button>
                        <button
                            className="btn btn-outline"
                            style={{ width: '100%', marginBottom: '12px' }}
                            onClick={() => {
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assessment, null, 2));
                                const downloadAnchorNode = document.createElement('a');
                                downloadAnchorNode.setAttribute("href", dataStr);
                                downloadAnchorNode.setAttribute("download", `audit_trail_${assessment.id}.json`);
                                document.body.appendChild(downloadAnchorNode);
                                downloadAnchorNode.click();
                                downloadAnchorNode.remove();
                            }}
                        >
                            Export Audit Trail (JSON)
                        </button>
                        <button className="btn btn-outline" style={{ width: '100%', border: '1px solid #ff4d4d', color: '#ff4d4d' }}>Flag for Review</button>
                    </div>
                </aside>
            </div>
        </div>
    )
}
