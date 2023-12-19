import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

interface RegisterPayload {
  name: string
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as RegisterPayload

    const hashedPassword = await hash(password, 12)

    const userExists = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (userExists) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: 'Usuário já cadastrado.',
        }),
        { status: 409 }
      )
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
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
