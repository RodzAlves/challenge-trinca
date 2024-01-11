import { Barbecue } from '@prisma/client'
import { ParticipantsInfo } from './participant'

export type BarbecueWithParticipantsData = ParticipantsInfo & Barbecue
