'use server'

import { prisma } from '@/lib/prisma'
import { Barbecue, Participant } from '@prisma/client'
import { ReturnActionType } from './types'
import { revalidatePath } from 'next/cache'
import { CreatePayload } from '@/types/db'
import { sleep } from '@/utils/sleep'
import { ParticipantsInfo } from '@/types/participant'

function getParticipantsInfo(participants: Participant[]): ParticipantsInfo {
  if (!participants) {
    return {
      totalParticipants: 0,
      totalCollected: 0,
      totalDebt: 0,
    }
  }

  const totals = participants.reduce(
    (acc, curr) => {
      if (!curr?.isPaid) {
        return {
          totalDebt: acc.totalDebt + (curr?.amount ?? 0),
          totalCollected: acc.totalCollected,
        }
      }

      return {
        totalDebt: acc.totalDebt,
        totalCollected: acc.totalCollected + (curr?.amount ?? 0),
      }
    },
    {
      totalDebt: 0,
      totalCollected: 0,
    }
  )

  const totalParticipants = participants.length

  return {
    totalParticipants,
    ...totals,
  }
}

export async function getBarbecues() {
  const barbecues = await prisma.barbecue.findMany({
    include: {
      participants: true,
    },
  })

  const barbecuesWithParticipantsData = barbecues.map((barbecue) => {
    const participantsInfo = getParticipantsInfo(barbecue.participants)

    return {
      ...barbecue,
      ...participantsInfo,
    }
  })

  await sleep(1000)

  return barbecuesWithParticipantsData
}

export async function deleteBarbecue(
  id: string
): Promise<ReturnActionType<Barbecue>> {
  const barbecue = await prisma.barbecue.findUnique({
    where: {
      id,
    },
  })

  if (!barbecue) {
    return {
      error: 'Churrasco não encontrado!',
    }
  }

  await prisma.barbecue.delete({
    where: {
      id: id,
    },
  })

  await prisma.participant.deleteMany({
    where: {
      barbecueId: id,
    },
  })
}

export async function getBarbecueDetails(id: string) {
  const barbecue = await prisma.barbecue.findUnique({
    where: {
      id,
    },
    include: {
      participants: true,
    },
  })

  if (!barbecue) {
    return null
  }

  const participantsInfo = getParticipantsInfo(barbecue.participants)

  await sleep(1000)

  return {
    ...barbecue,
    ...participantsInfo,
  }
}

export async function createBarbecue(payload: CreatePayload<Barbecue>) {
  const barbecue = await prisma.barbecue.create({
    data: payload,
  })

  revalidatePath(`/barbecue`)

  return barbecue
}
