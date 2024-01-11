'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { NewParticipantForm } from './new-participant-form'
import { DollarSign } from 'lucide-react'
import { PersonIcon } from '@radix-ui/react-icons'
import { formatCurrency } from '@/lib/utils'
import { BarbecueWithParticipantsData } from '@/types/barbecue'

type DetailsHeaderProps = BarbecueWithParticipantsData

export function DetailsHeader(barbecue: DetailsHeaderProps) {
  const [openDialog, setOpenDialog] = useState(false)

  const handleClose = useCallback(() => {
    setOpenDialog(false)
  }, [])

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div className="flex flex-row items-baseline justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold text-accent-foreground mb-4">
            {barbecue.name}
          </h1>

          <div className="flex items-center">
            <PersonIcon className="h-6 w-6 mr-2" />
            <p className="text-sm font-medium text-accent-foreground">
              {barbecue.totalParticipants} Participantes
            </p>
          </div>
          <div className="flex items-center space-x-1 text-sm text-card-foreground">
            <DollarSign className="h-6 w-6 mr-2 text-green-600" />
            <span className="text-green-600">
              <b>PAGOS</b> - {formatCurrency(barbecue.totalCollected)}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-sm text-card-foreground">
            <DollarSign className="h-6 w-6 mr-2 text-destructive" />
            <span className="text-destructive">
              <b>A RECEBER</b> - {formatCurrency(barbecue.totalDebt)}
            </span>
          </div>
        </div>

        <DialogTrigger asChild>
          <Button variant="default">Novo Participante</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo participante</DialogTitle>
          <DialogDescription>
            Chame aquele amigo da empresa para curtir um churras com você!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <NewParticipantForm close={handleClose} barbecue={barbecue} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
