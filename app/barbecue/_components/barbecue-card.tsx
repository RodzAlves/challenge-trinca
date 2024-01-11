'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatCurrency } from '@/lib/utils'
import { BarbecueWithParticipantsData } from '@/types/barbecue'
import { PersonIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { ChevronRight, DollarSign, Trash } from 'lucide-react'

export type BarbecueCardProps = {
  handleDelete: (id: string) => void
  handleDetails: (id: string) => void
} & BarbecueWithParticipantsData

export function BarbecueCard({
  id,
  name,
  date,
  description,
  totalParticipants,
  totalCollected,
  handleDelete,
  handleDetails,
}: BarbecueCardProps) {
  return (
    <Card className="flex flex-col w-full justify-between shadow-lg hover:border-primary hover:shadow-2xl">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>{name}</CardTitle>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  onClick={() => handleDetails(id)}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Ver detalhes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {description && (
          <CardDescription className="break-words">
            {description}
          </CardDescription>
        )}

        <CardDescription className="font-extrabold">
          {format(new Date(date), 'dd/MM/yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-row justify-between items-end">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <PersonIcon className="h-6 w-6 mr-2" />
              <p className="text-sm font-medium text-accent-foreground">
                {totalParticipants} Participantes
              </p>
            </div>
            <div className="flex items-center space-x-1 text-sm text-card-foreground">
              <DollarSign className="h-6 w-6 mr-2" />
              {formatCurrency(totalCollected)} Arrecadado
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  onClick={() => handleDelete(id)}
                >
                  <Trash className="w-6 h-6 text-destructive" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Deletar churrasco</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
