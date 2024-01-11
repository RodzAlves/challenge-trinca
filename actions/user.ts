'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { ReturnActionType } from './types'
import { User } from '@prisma/client'

export async function createUser(payload: {
  email: string
  password: string
}): Promise<ReturnActionType<User>> {
  const { email, password } = payload

  const hashedPassword = await hash(password, 12)

  const userExists = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  })

  if (userExists) {
    return {
      error: 'Usuário já cadastrado.',
    }
  }

  const name = email.split('@')[0]

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
    },
  })

  return user
}
