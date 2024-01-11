'use client'

import {
  deleteParticipant,
  participantPayBarbecue,
} from '@/actions/participant'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import { cn, formatCurrency } from '@/lib/utils'
import { refreshAction } from '@/utils/refresh-action'
import { Participant } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export type ParticipantListProps = {
  participants: Participant[]
}

export function ParticipantList({ participants }: ParticipantListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [participantId, setParticipantId] = useState<string | null>(null)

  const handleDelete = useCallback(async () => {
    if (!participantId) return

    try {
      const response = await deleteParticipant(participantId)

      if (response?.error) {
        toast({
          variant: 'destructive',
          title: 'Oops! Aconteceu algo.',
          description:
            response?.error ?? 'Teve um problema ao deletar o churrasco.',
        })

        return
      }

      await refreshAction(
        () => router.refresh(),
        () =>
          toast({
            title: 'Participante deletado com sucesso!',
          })
      )
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Oops! Aconteceu algo.',
        description:
          error?.message ?? 'Teve um problema ao deletar o participante.',
      })
    }
  }, [router, participantId])

  const handlePay = useCallback(
    async (id: string) => {
      setIsLoading(true)

      try {
        await participantPayBarbecue(id)

        await refreshAction(
          () => router.refresh(),
          () =>
            toast({
              title: 'Participante atualizado com sucesso!',
            })
        )
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Oops! Aconteceu algo.',
          description:
            error?.message ?? 'Teve um problema ao atualizar o participante.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const handleOpenConfirmDelete = useCallback((id: string) => {
    setParticipantId(id)
    setOpenConfirmDialog(true)
  }, [])

  if (!participants) {
    return null
  }

  return (
    <>
      <AlertDialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Você tem certeza que deseja deletar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não poderá ser desfeita, esse participante será
              deletado!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {participants.map(({ id, isPaid, name, amount }) => (
        <div
          key={id}
          className="w-full p-4 flex items-center justify-between space-x-2 rounded-lg border bg-card text-card-foreground shadow-lg hover:border-primary hover:shadow-2xl"
        >
          <div className="flex flex-rol items-center justify-center gap-4">
            <Checkbox
              id="paid"
              aria-checked={isPaid}
              checked={isPaid}
              onCheckedChange={() => handlePay(id)}
              disabled={isPaid || isLoading}
            />
            <label
              htmlFor="paid"
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                isPaid && 'line-through'
              )}
            >
              {name}
            </label>
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex items-center space-x-1 text-sm text-card-foreground">
              {formatCurrency(amount)}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    onClick={() => handleOpenConfirmDelete(id)}
                  >
                    <Trash className="w-6 h-6 text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Deletar participante</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}
    </>
  )
}
