import React from 'react'
import Sidebar from '@/components/Sidebar'
import styles from './layout.module.css'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}
