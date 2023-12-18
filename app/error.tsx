'use client' // Error components must be Client Components

import * as React from 'react'
import { AlarmCheckIcon, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <main>
      <section className="bg-background">
        <div className="layout flex min-h-screen flex-col items-center justify-center text-center text-black space-y-4">
          <ShieldAlert
            size={60}
            className="drop-shadow-glow animate-flicker text-red-500"
          />
          <h1 className="text-2xl md:text-4xl">
            Oops, aconteceu algo inesperado!
          </h1>
          <Button onClick={reset}>Tentar novamente</Button>
        </div>
      </section>
    </main>
  )
}
