import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface BarbecuePayload {
  name: string
  date: string
  description: string
  suggestedValue: number
  suggestedValueWithDrink: number
}

export async function GET() {
  const barbecues = await prisma.barbecue.findMany({
    include: {
      participants: true,
    },
  })

  const barbecuesWithIndicators = barbecues.map((barbecue) => {
    const totalCollected = barbecue.participants.reduce((acc, curr) => {
      return acc + (curr?.value ?? 0)
    }, 0)

    const totalParticipants = barbecue.participants.length

    return {
      ...barbecue,
      totalParticipants,
      totalCollected,
    }
  })

  return NextResponse.json({
    barbecues: barbecuesWithIndicators,
  })
}

export async function POST(req: Request) {
  try {
    const { name, date, description, suggestedValue, suggestedValueWithDrink } =
      (await req.json()) as BarbecuePayload

    const barbecue = await prisma.barbecue.create({
      data: {
        name,
        date,
        description,
        suggestedValue,
        suggestedValueWithDrink,
      },
    })

    return NextResponse.json({
      barbecue,
    })
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message,
      }),
      { status: 500 }
    )
  }
}
