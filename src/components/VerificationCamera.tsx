'use client'

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from '@vladmandic/face-api'
import styles from './VerificationCamera.module.css'

interface VerificationCameraProps {
    onStatusChange?: (isVerified: boolean, type?: string) => void;
}

export interface VerificationCameraHandle {
    takeSnapshot: () => string | null;
}

const VerificationCamera = forwardRef<VerificationCameraHandle, VerificationCameraProps>(({ onStatusChange }, ref) => {
    const webcamRef = useRef<Webcam>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isModelLoaded, setIsModelLoaded] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle')
    const [failureReason, setFailureReason] = useState<string | null>(null)

    useImperativeHandle(ref, () => ({
        takeSnapshot: () => {
            if (webcamRef.current) {
                return webcamRef.current.getScreenshot()
            }
            return null
        }
    }))

    // Load models
    // Head Pose / Gaze Detection logic
    const detectHeadPose = (landmarks: any) => {
        // Basic heuristic: Compare distance between nose and both eyes
        const leftEye = landmarks.getLeftEye()[0]
        const rightEye = landmarks.getRightEye()[3]
        const noseTip = landmarks.getNose()[3]

        const leftDist = Math.abs(noseTip.x - leftEye.x)
        const rightDist = Math.abs(noseTip.x - rightEye.x)
        const ratio = leftDist / rightDist

        // If ratio is skewed (> 1.6 or < 0.6), the head is likely turned
        if (ratio > 1.8 || ratio < 0.55) {
            return 'Diverted'
        }
        return 'Main'
    }

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ])
                setIsModelLoaded(true)
                console.log('Models loaded')
            } catch (error) {
                console.error('Error loading models:', error)
                setFailureReason('Failed to load AI models')
            }
        }
        loadModels()
    }, [])

    // Detection Loop
    useEffect(() => {
        if (!isModelLoaded) return

        const interval = setInterval(async () => {
            if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
                const video = webcamRef.current.video

                // Detect faces
                const detections = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceLandmarks()

                // Update UI/Canvas
                if (canvasRef.current) {
                    const canvas = canvasRef.current
                    const displaySize = { width: video.videoWidth, height: video.videoHeight }
                    faceapi.matchDimensions(canvas, displaySize)
                    const resizedDetections = faceapi.resizeResults(detections, displaySize)

                    const ctx = canvas.getContext('2d')
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        faceapi.draw.drawDetections(canvas, resizedDetections)
                    }
                }

                // Verification Logic
                if (detections.length === 1) {
                    if (detections[0].detection.score > 0.5) {
                        setVerificationStatus('verified')
                        // Gaze Detection
                        const pose = detectHeadPose(detections[0].landmarks)
                        if (pose === 'Diverted') {
                            onStatusChange?.(false, 'Gaze Divergence')
                            setFailureReason('Please look directly at the camera')
                            setVerificationStatus('failed')
                        } else {
                            onStatusChange?.(true)
                            setFailureReason(null)
                        }
                    } else {
                        setVerificationStatus('scanning')
                    }
                } else if (detections.length === 0) {
                    setVerificationStatus('failed')
                    setFailureReason('No face detected')
                    onStatusChange?.(false, 'No face detected')
                } else {
                    setVerificationStatus('failed')
                    setFailureReason('Multiple faces detected')
                    onStatusChange?.(false, 'Multiple faces detected')
                }
            }
        }, 500) // Check every 500ms

        return () => clearInterval(interval)
    }, [isModelLoaded, onStatusChange])

    return (
        <div className={styles.container}>
            <div className={styles.cameraWrapper}>
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    className={styles.webcam}
                    mirrored={true}
                />
                <canvas ref={canvasRef} className={styles.canvas} />

                {/* Status Overlay */}
                <div className={`${styles.statusOverlay} ${styles[verificationStatus]}`}>
                    <div className={styles.statusDot}></div>
                    <span className={styles.statusText}>
                        {verificationStatus === 'idle' && 'Initializing...'}
                        {verificationStatus === 'scanning' && 'Scanning...'}
                        {verificationStatus === 'verified' && 'Verified Identity'}
                        {verificationStatus === 'failed' && (failureReason || 'Verification Failed')}
                    </span>
                </div>
            </div>
        </div>
    )
})

export default VerificationCamera
