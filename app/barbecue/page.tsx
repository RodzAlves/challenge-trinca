import { BarbecueCard, BarbecueCardProps } from '@/components/barbecue-card'
import React from 'react'

async function getBarbecues() {
  const response = await fetch('/api/barbecue', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()

  return data as BarbecueCardProps[]
}

export default async function Barbecue() {
  const barbecues = await getBarbecues()

  return (
    <div className="">
      {barbecues.map((barbecue) => (
        <BarbecueCard key={barbecue.id} {...barbecue} />
      ))}
    </div>
  )
}
