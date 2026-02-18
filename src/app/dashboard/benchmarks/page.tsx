'use client'

import React from 'react'
import styles from '../page.module.css'

export default function BenchmarksPage() {
    return (
        <div className={styles.content}>
            <header className={styles.header}>
                <h1>Global <span className="text-gradient">Benchmarks</span></h1>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Industry Percentile</span>
                    <span className={styles.statValue}>Top 5%</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Avg. Time to Verify</span>
                    <span className={styles.statValue}>12m</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Fraud Deterrence</span>
                    <span className={styles.statValue}>99.2%</span>
                </div>
            </div>

            <section className={styles.tableSection} style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ opacity: 0.5 }}>
                    <h2>Trust Distribution Chart</h2>
                    <p>Coming soon: Interactive visualization of candidate integrity metrics across departments.</p>
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.03)', margin: '20px 0', borderRadius: '12px', border: '1px dashed var(--color-border)' }}></div>
                </div>
            </section>
        </div>
    )
}
