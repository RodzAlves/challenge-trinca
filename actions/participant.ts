'use server'

import { prisma } from '@/lib/prisma'
import { CreatePayload } from '@/types/db'
import { Participant } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { ReturnActionType } from './types'

export async function createParticipant(
  payload: CreatePayload<Participant>
): Promise<ReturnActionType<Participant>> {
  const { name, amount, barbecueId, email } = payload

  const participant = await prisma.participant.create({
    data: {
      name,
      amount,
      barbecueId,
      email,
    },
  })

  revalidatePath(`/barbecue/${barbecueId}`)

  return participant
}

export async function participantPayBarbecue(
  id: string
): Promise<ReturnActionType<Participant>> {
  const participant = await prisma.participant.findUnique({
    where: {
      id,
    },
  })

  if (!participant) {
    return {
      error: 'Participante não encontrado!',
    }
  }

  const newIsPaidStatus = !participant.isPaid

  const participantUpdated = await prisma.participant.update({
    where: {
      id,
    },
    data: {
      isPaid: newIsPaidStatus,
    },
  })

  revalidatePath(`/barbecue/${participant.barbecueId}`)

  return participantUpdated
}

export async function deleteParticipant(
  id: string
): Promise<ReturnActionType<Participant>> {
  const participant = await prisma.participant.findUnique({
    where: {
      id,
    },
  })

  if (!participant) {
    return {
      error: 'Participante não encontrado!',
    }
  }

  await prisma.participant.delete({
    where: {
      id: id,
    },
  })

  revalidatePath(`/barbecue/${participant.barbecueId}`)

  return participant
}
