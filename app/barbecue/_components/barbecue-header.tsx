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
import { CreateBarbecueForm } from './create-form'

export function BarbecueHeader() {
  const [openDialog, setOpenDialog] = useState(false)

  const handleClose = useCallback(() => {
    setOpenDialog(false)
  }, [])

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-semibold text-accent-foreground">
          Churrascos
        </h1>
        <DialogTrigger asChild>
          <Button variant="default">Novo Churrasco</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar novo churrasco</DialogTitle>
          <DialogDescription>
            Organize aquele churras com os amigos da Trinca!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CreateBarbecueForm close={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
