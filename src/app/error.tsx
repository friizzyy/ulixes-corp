'use client'

import { useEffect } from 'react'
import { StatusPage } from '@/components/legal/status-page'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <StatusPage
      eyebrow="Something went wrong"
      title="This page failed to load."
      body="The error has been logged, and trying again usually clears it."
      primary={{ label: 'Try again', onClick: reset }}
      secondary={{ label: 'Return home', href: '/' }}
    />
  )
}
