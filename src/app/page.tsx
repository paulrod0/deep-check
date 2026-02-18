import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.logo}>Deep-Check<span style={{ color: 'var(--color-primary)' }}>.</span></div>
          <a href="#demo" className="btn btn-primary">Book Demo</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badge}>Trust Architecture 2026</div>
            <h1 className={styles.title}>
              The <span className="text-gradient">End of Remote Fraud.</span><br />
              Continuous Identity Verification.
            </h1>
            <p className={styles.subtitle}>
              Hiring a remote senior dev costs <strong>$30,000 USD</strong> in risk if they use AI to fake the interview.
              Deep-Check validates identity continuously, not just at login.
            </p>
            <div className={styles.ctaGroup}>
              <Link href="/interview" className="btn btn-primary">Start Verification Loop</Link>
              <a href="#how" className="btn btn-outline">How it Works</a>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className={styles.glow} style={{ top: '-20%', left: '20%', background: 'var(--color-secondary)' }}></div>
        <div className={styles.glow} style={{ top: '40%', right: '10%', background: 'var(--color-primary)' }}></div>
      </section>

      {/* The Risk / Stats */}
      <section className={styles.stats}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 className="section-title">The Crisis of Trust</h2>
            <div className={styles.grid}>
              <div className={styles.statItem}>
                <h3>$30k+</h3>
                <p>Avg. Loss per Bad Hire</p>
              </div>
              <div className={styles.statItem}>
                <h3>97%</h3>
                <p>Remote Identity Fraud Increase</p>
              </div>
              <div className={styles.statItem}>
                <h3>0%</h3>
                <p>Confidence in Current Tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Moat (Features) */}
      <section id="how" className={styles.features}>
        <div className="container">
          <h2 className="section-title">The Deep-Check <span className="text-gradient">Moat</span></h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.icon}>🧬</div>
              <h3>Behavioral Biometrics</h3>
              <p>We analyze keystroke dynamics (flight time, hold time). The way they type is as unique as a fingerprint.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>👁️</div>
              <h3>Liveness Detection</h3>
              <p>Anti-Deepfake technology monitors micro-expressions and lighting reflections in real-time.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>🤖</div>
              <h3>Code Forensics</h3>
              <p>Detects if code "appears" instantly (LLM Copy/Paste) or evolves naturally. Calculates Perplexity Scores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className={styles.footer}>
        <div className="container">
          <h2>Standardize Trust.</h2>
          <p>Join the waitlist for the Enterprise Beta.</p>
          <form className={styles.form}>
            <input type="email" placeholder="enter@enterprise.com" className={styles.input} />
            <button className="btn btn-primary">Get Early Access</button>
          </form>
          <div style={{ marginTop: '4rem', color: 'var(--color-text-muted)' }}>
            © 2026 Deep-Check Inc. Built on Google Antigravity.
          </div>
        </div>
      </footer>
    </main>
  )
}
