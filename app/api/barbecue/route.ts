import { prisma } from '@/lib/prisma'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

interface BarbecuePayload {
  name: string
  date: string
  description: string
  suggestedValue: number
  suggestedValueWithDrink: number
}

export async function POST(req: NextApiRequest) {
  try {
    const { name, date, description, suggestedValue, suggestedValueWithDrink } =
      req.body as BarbecuePayload

    const barbecue = await prisma.barbecue.create({
      data: {
        name,
        date,
        description,
        suggestedValue,
        suggestedValueWithDrink,
      },
    })

    console.log(barbecue)

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

export async function DELETE(req: NextApiRequest) {
  console.log('received request')
  const { id } = req.query

  try {
    const barbecue = await prisma.barbecue.findUnique({
      where: {
        id: id as string,
      },
    })

    if (!barbecue) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: 'Churrasco não encontrado!',
        }),
        { status: 404 }
      )
    }

    await prisma.barbecue.delete({
      where: {
        id: id as string,
      },
    })

    await prisma.participant.deleteMany({
      where: {
        barbecueId: id as string,
      },
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
