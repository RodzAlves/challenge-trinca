'use client'

import { toast } from '@/components/ui/use-toast'
import { BarbecueWithParticipantsData } from '@/types/barbecue'
import { useCallback, useState } from 'react'
import { BarbecueCard } from './barbecue-card'
import { useRouter } from 'next/navigation'
import { deleteBarbecue } from '@/actions/barbecue'
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
import { refreshAction } from '@/utils/refresh-action'

export type BarbecueListProps = {
  barbecues: BarbecueWithParticipantsData[]
}

export function BarbecueList({ barbecues }: BarbecueListProps) {
  const router = useRouter()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [barbecueId, setBarbecueId] = useState<string | null>(null)

  const handleDelete = useCallback(async () => {
    if (!barbecueId) return

    try {
      setOpenConfirmDialog(false)
      setBarbecueId(null)

      const response = await deleteBarbecue(barbecueId)

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
            title: 'Churrasco deletado com sucesso!',
          })
      )
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Oops! Aconteceu algo.',
        description:
          error?.message ?? 'Teve um problema ao deletar o churrasco.',
      })
    }
  }, [router, barbecueId])

  const handleOpenConfirmDelete = useCallback((id: string) => {
    setBarbecueId(id)
    setOpenConfirmDialog(true)
  }, [])

  const handleDetails = useCallback(
    (id: string) => {
      router.push(`/barbecue/${id}`)
    },
    [router]
  )

  if (!barbecues) {
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
              Essa ação não poderá ser desfeita, seu churrasco será deletado!
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

      {barbecues.map((barbecue) => (
        <BarbecueCard
          key={barbecue.id}
          {...barbecue}
          handleDelete={handleOpenConfirmDelete}
          handleDetails={handleDetails}
        />
      ))}
    </>
  )
}
