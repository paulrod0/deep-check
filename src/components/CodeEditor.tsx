'use client'

import React, { useRef, useState, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import styles from './CodeEditor.module.css'

interface KeystrokeEvent {
    key: string;
    pressTime: number;
    releaseTime?: number;
    holdTime?: number;
    flightTime?: number;
}

interface CodeEditorProps {
    onBiometricEvent?: (metrics: any) => void;
}

export default function CodeEditor({ onBiometricEvent }: CodeEditorProps) {
    const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([])
    const [baseline, setBaseline] = useState<{ mean: number, stdDev: number } | null>(null)
    const [isCalibrating, setIsCalibrating] = useState(true)
    const lastReleaseTime = useRef<number>(performance.now())
    const activeKeys = useRef<Map<string, number>>(new Map())
    const calibrationPool = useRef<number[]>([])

    const handleEditorMount: OnMount = (editor, monaco) => {
        // Basic setup
        monaco.editor.setTheme('vs-dark')

        // Add keydown listener to the editor's dom node
        const domNode = editor.getDomNode()
        if (domNode) {
            domNode.addEventListener('keydown', (e: any) => {
                const now = performance.now()
                if (!activeKeys.current.has(e.key)) {
                    activeKeys.current.set(e.key, now)

                    const flightTime = lastReleaseTime.current ? now - lastReleaseTime.current : 0

                    // Log key press (internal state)
                    // We'll update the event with releaseTime in keyup
                }
            })

            domNode.addEventListener('keyup', (e: any) => {
                const now = performance.now()
                const pressTime = activeKeys.current.get(e.key)

                if (pressTime) {
                    const holdTime = now - pressTime
                    const flightTime = lastReleaseTime.current ? pressTime - lastReleaseTime.current : 0

                    const event: KeystrokeEvent = {
                        key: e.key,
                        pressTime,
                        releaseTime: now,
                        holdTime,
                        flightTime
                    }

                    setKeystrokes(prev => [...prev.slice(-49), event])
                    lastReleaseTime.current = now
                    activeKeys.current.delete(e.key)

                    // Calibration Logic
                    if (isCalibrating) {
                        calibrationPool.current.push(flightTime)
                        if (calibrationPool.current.length >= 30) {
                            const mean = calibrationPool.current.reduce((a, b) => a + b, 0) / calibrationPool.current.length
                            const variance = calibrationPool.current.reduce((a, b) => a + (b - mean) ** 2, 0) / calibrationPool.current.length
                            const stdDev = Math.sqrt(variance)
                            setBaseline({ mean, stdDev })
                            setIsCalibrating(false)
                        }
                    } else if (baseline) {
                        // Z-Score Detection
                        const zScore = Math.abs((flightTime - baseline.mean) / (baseline.stdDev || 1))
                        if (zScore > 3.0) {
                            onBiometricEvent?.({ type: 'inconsistency', zScore, key: e.key })
                        }
                    }

                    // Original burst detection still active
                    if (flightTime < 8 && flightTime > 0) {
                        onBiometricEvent?.({ type: 'burst' })
                    }

                    onBiometricEvent?.({
                        type: 'keystroke',
                        holdTime,
                        flightTime,
                        key: e.key
                    })
                }
            })

            // Paste Detection
            domNode.addEventListener('paste', (e: any) => {
                const text = e.clipboardData?.getData('text') || ''
                onBiometricEvent?.({
                    type: 'paste',
                    length: text.length,
                    timestamp: performance.now()
                })
            })
        }
    }

    // Calculate Average Metrics for visualization
    const averageHoldTime = keystrokes.length
        ? keystrokes.reduce((acc, k) => acc + (k.holdTime || 0), 0) / keystrokes.length
        : 0

    return (
        <div className={styles.container}>
            <div className={styles.editorWrapper}>
                <Editor
                    height="100%"
                    defaultLanguage="typescript"
                    defaultValue="// Write your code here... \nfunction solveProblem() {\n  \n}"
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                    onMount={handleEditorMount}
                />
            </div>

            {/* Real-time Biometric Monitor */}
            <div className={styles.monitor}>
                <div className={styles.monitorHeader}>
                    <span className={styles.pulse}></span> Live Biometric Feed
                </div>
                <div className={styles.metric}>
                    <span>Hold Time:</span>
                    <span>{averageHoldTime.toFixed(2)}ms</span>
                </div>
                <div className={styles.metric}>
                    <span>Baseline:</span>
                    <span>{isCalibrating ? `Calibrating (${calibrationPool.current.length}/30)...` : 'Set'}</span>
                </div>
                <div className={styles.metric}>
                    <span>Rhythm Stability:</span>
                    <span style={{ color: !isCalibrating ? 'var(--color-primary)' : 'inherit' }}>
                        {!isCalibrating ? 'High' : 'Calculating...'}
                    </span>
                </div>
                <div className={styles.history}>
                    {keystrokes.map((k, i) => (
                        <div key={i} className={styles.keyDot} style={{ opacity: Math.max(0.1, (i + 1) / keystrokes.length) }}></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
