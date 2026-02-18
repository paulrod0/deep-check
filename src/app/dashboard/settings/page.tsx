'use client'

import React from 'react'
import styles from '../page.module.css'

export default function SettingsPage() {
    return (
        <div className={styles.content}>
            <header className={styles.header}>
                <h1>Account <span className="text-gradient">Settings</span></h1>
            </header>

            <section className={styles.tableSection} style={{ padding: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                        <h3 style={{ marginBottom: '12px' }}>Verification Thresholds</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Min. "Passed" Score</label>
                                <input type="number" defaultValue={85} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Flagging Sensitivity</label>
                                <select style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white', width: '100%' }}>
                                    <option>High (Strict)</option>
                                    <option selected>Standard</option>
                                    <option>Low (Lax)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '12px' }}>Organization Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input type="text" placeholder="Organization Name" defaultValue="Apple (Candidate Review)" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white' }} />
                            <input type="email" placeholder="Billing Email" defaultValue="security@apple.com" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '10px', borderRadius: '8px', color: 'white' }} />
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                </div>
            </section>
        </div>
    )
}
