'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

import { VerificationCameraHandle } from '@/components/VerificationCamera'

const VerificationCameraDynamic = dynamic(() => import('@/components/VerificationCamera'), {
    ssr: false,
    loading: () => <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>Loading AI Models...</div>
})

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
    ssr: false,
    loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Initializing Editor...</div>
})

function SessionReport({ assessment, onRestart }: { assessment: any, onRestart: () => void }) {
    return (
        <div style={{ padding: '60px', maxWidth: '800px', margin: '0 auto', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Trust Certificate</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Security ID: {assessment.id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: assessment.score > 85 ? 'var(--color-primary)' : '#ff4d4d' }}>{assessment.score}%</div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Integrity Score</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Candidate Intelligence</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><strong>Name:</strong> {assessment.candidateName}</div>
                        <div><strong>Role:</strong> {assessment.role}</div>
                        <div><strong>Status:</strong> <span style={{ color: assessment.score > 85 ? 'var(--color-primary)' : '#ff4d4d' }}>{assessment.status.toUpperCase()}</span></div>
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Behavioral Forensics</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                        <div>• Liveness Signature: VERIFIED</div>
                        <div>• Keystroke Flight Time: CONSISTENT</div>
                        <div>• Clipboard Activity: {assessment.alerts.some((a: any) => a.includes('Paste')) ? 'FLAGGED' : 'CLEAN'}</div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '16px' }}>Incident Timeline</h3>
                {assessment.alerts.length === 0 ? (
                    <p style={{ color: 'var(--color-primary)', opacity: 0.6 }}>No security incidents recorded during this session.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {assessment.alerts.map((alert: string, idx: number) => (
                            <div key={idx} style={{ padding: '12px', background: 'rgba(255, 77, 77, 0.1)', borderLeft: '3px solid #ff4d4d', borderRadius: '4px', fontSize: '0.85rem' }}>
                                {alert}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                <button onClick={onRestart} className="btn btn-outline">Start New Test</button>
            </div>
        </div>
    )
}

export default function InterviewPage() {
    const [candidateName, setCandidateName] = useState('Remote Candidate')
    const [isVerified, setIsVerified] = useState(false)
    const [trustScore, setTrustScore] = useState(100)
    const [biometrics, setBiometrics] = useState({ typingActive: false, lastEvent: '' })
    const [alerts, setAlerts] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [sessionEnded, setSessionEnded] = useState(false)
    const [lastAssessment, setLastAssessment] = useState<any>(null)
    const [evidence, setEvidence] = useState<{ timestamp: string, image: string, reason: string }[]>([])
    const cameraRef = React.useRef<VerificationCameraHandle>(null)

    const captureEvidence = (reason: string) => {
        const snapshot = cameraRef.current?.takeSnapshot()
        if (snapshot) {
            setEvidence(prev => [...prev, {
                timestamp: new Date().toLocaleTimeString(),
                image: snapshot,
                reason
            }].slice(-5)) // Keep last 5 pieces of evidence
        }
    }

    const handleVerificationChange = (verified: boolean, type?: string) => {
        setIsVerified(verified)
        if (!verified) {
            setTrustScore(prev => Math.max(prev - (type === 'Gaze Divergence' ? 5 : 2), 0))
            if (type === 'Gaze Divergence') {
                const timestamp = new Date().toLocaleTimeString()
                setAlerts(prev => [`[${timestamp}] Potential Distraction Detected`, ...prev].slice(0, 5))
                captureEvidence('Gaze Divergence')
            }
        }
    }

    // Visibility & Focus Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                const timestamp = new Date().toLocaleTimeString()
                setAlerts(prev => [`[${timestamp}] Tab Switch Detected`, ...prev].slice(0, 5))
                setTrustScore(prev => Math.max(prev - 10, 0))
                captureEvidence('Tab Switch')
            }
        }

        const handleBlur = () => {
            const timestamp = new Date().toLocaleTimeString()
            setAlerts(prev => [`[${timestamp}] Window Focus Lost`, ...prev].slice(0, 5))
            setTrustScore(prev => Math.max(prev - 5, 0))
            captureEvidence('Focus Lost')
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('blur', handleBlur)

        // Multi-screen detection heuristic
        const checkHardwareSecurity = () => {
            // Check for extended monitors via Window Management API (if supported) or basic screen width heuristics
            const isExtended = (window.screen as any).isExtended || (window.screen.availWidth > window.screen.width * 1.5)
            if (isExtended) {
                const timestamp = new Date().toLocaleTimeString()
                setAlerts(prev => [`[${timestamp}] Extended Display Detected`, ...prev].slice(0, 5))
                // We don't penalize heavily but we log it and snapshot
                captureEvidence('Multi-monitor setup')
            }
        }

        checkHardwareSecurity()

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('blur', handleBlur)
        }
    }, [])

    const handleBiometricEvent = (event: any) => {
        if (event.type === 'keystroke') {
            setBiometrics(prev => ({ ...prev, typingActive: true, lastEvent: 'Typing...' }))
        } else if (event.type === 'paste') {
            const penalty = event.length > 100 ? 15 : 5
            setTrustScore(prev => Math.max(prev - penalty, 0))
            const timestamp = new Date().toLocaleTimeString()
            setAlerts(prev => [`[${timestamp}] Paste Detected (${event.length} chars)`, ...prev].slice(0, 5))
            setBiometrics(prev => ({ ...prev, lastEvent: `Large Paste Detected (-${penalty}%)` }))
        } else if (event.type === 'burst') {
            setTrustScore(prev => Math.max(prev - 20, 0))
            const timestamp = new Date().toLocaleTimeString()
            setAlerts(prev => [`[${timestamp}] AI Burst Detected!`, ...prev].slice(0, 5))
            captureEvidence('AI Burst Detection')
        } else if (event.type === 'inconsistency') {
            setTrustScore(prev => Math.max(prev - 10, 0))
            const timestamp = new Date().toLocaleTimeString()
            setAlerts(prev => [`[${timestamp}] Biometric Inconsistency (-10%)`, ...prev].slice(0, 5))
            captureEvidence('Typing Pattern Shift')
        }
    }

    const handleEndSession = async () => {
        setIsSaving(true);
        const assessment = {
            id: Math.random().toString(36).substr(2, 9),
            candidateName,
            role: 'React Candidate',
            date: new Date().toISOString().split('T')[0],
            score: trustScore,
            status: trustScore > 85 ? 'passed' : trustScore > 60 ? 'review' : 'flagged',
            alerts,
            evidence,
            lastEvent: biometrics.lastEvent || 'Session ended'
        };

        try {
            await fetch('/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assessment)
            });
            setLastAssessment(assessment);
            setSessionEnded(true);
        } catch (error) {
            console.error('Failed to save assessment:', error);
            alert('Failed to save assessment. Please check console.');
        } finally {
            setIsSaving(false);
        }
    }

    if (sessionEnded && lastAssessment) {
        return (
            <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SessionReport assessment={lastAssessment} onRestart={() => window.location.reload()} />
            </main>
        )
    }

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logo}>Deep-Check<span style={{ color: 'var(--color-primary)' }}>.</span></div>
                <div className={styles.sessionInfo}>
                    <span className={styles.sessionBadge}>LIVE SESSION #8293</span>
                    <div className={styles.trustIndicator}>
                        <span className={styles.trustLabel}>Trust Score:</span>
                        <span className={styles.trustValue} style={{ color: trustScore > 70 ? 'var(--color-primary)' : '#ff4d4d' }}>
                            {trustScore}%
                        </span>
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                    onClick={handleEndSession}
                    disabled={isSaving || sessionEnded}
                >
                    {isSaving ? 'Saving...' : sessionEnded ? 'Saved' : 'End Session'}
                </button>
            </header>

            <div className={styles.content}>
                {/* Main Coding Area */}
                <div className={styles.editorArea}>
                    <CodeEditor onBiometricEvent={handleBiometricEvent} />
                </div>

                {/* Sidebar / Verification */}
                <aside className={styles.sidebar}>
                    <section className={styles.section}>
                        <h3>Identity Verification</h3>
                        <VerificationCameraDynamic ref={cameraRef} onStatusChange={handleVerificationChange} />
                        <p className={styles.hint}>
                            Keep your face clearly visible within the frame. Continuous monitoring is active.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h3>Behavioral Biometrics</h3>
                        <div className={styles.biometricGrid}>
                            <div className={styles.biometricItem}>
                                <span>Liveness </span>
                                <span className={isVerified ? styles.active : styles.inactive}>Active</span>
                            </div>
                            <div className={styles.biometricItem}>
                                <span>Typing Rhythm</span>
                                <span className={biometrics.typingActive ? styles.active : styles.pending}>
                                    {biometrics.typingActive ? 'Analyzing...' : 'Awaiting Input'}
                                </span>
                            </div>
                            <div className={styles.biometricItem}>
                                <span>Clipboard Hygiene</span>
                                <span className={trustScore < 90 ? styles.inactive : styles.active}>
                                    {trustScore < 90 ? 'Flagged' : 'Protected'}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3>Live Security Alerts</h3>
                        <div className={styles.alertsContainer}>
                            {alerts.length === 0 ? (
                                <div className={styles.noAlerts}>No suspicious activity detected.</div>
                            ) : (
                                alerts.map((alert, idx) => (
                                    <div key={idx} className={styles.alertItem}>{alert}</div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3>Live Security Log</h3>
                        <div className={styles.assetList}>
                            <div className={styles.asset} style={{ color: biometrics.lastEvent.includes('Paste') || biometrics.lastEvent.includes('Burst') ? '#ff4d4d' : 'inherit' }}>
                                {biometrics.lastEvent || 'Initializing security loop...'}
                            </div>
                            <div className={styles.asset}>Verification Status: {isVerified ? 'PASSED' : 'MANUAL REVIEW'}</div>
                        </div>
                    </section>
                </aside>
            </div>
        </main>
    )
}
