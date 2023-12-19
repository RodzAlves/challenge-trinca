import * as React from 'react'
import { AlarmCheckIcon, ShieldAlert } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found',
}

export default function NotFound() {
  return (
    <main>
      <section className="bg-background">
        <div className="layout flex mt-4 min-h-max flex-col items-center justify-center text-center text-black space-y-4">
          <ShieldAlert
            size={60}
            className="drop-shadow-glow animate-flicker text-red-500"
          />
          <h1 className="text-2xl md:text-4xl">Oops, pagina não encontrada</h1>
          <a href="/">Voltar para tela inicial</a>
        </div>
      </section>
    </main>
  )
}
