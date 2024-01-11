'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Icons } from '@/components/icons'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { refreshAction } from '@/utils/refresh-action'
import { createBarbecue } from '@/actions/barbecue'

const createBarbecueSchema = z.object({
  name: z.string().min(4, 'O nome deve ter no minimo 4 caracteres.'),
  description: z.string().optional(),
  date: z
    .date({
      required_error: 'A data é obrigatória.',
    })
    .min(new Date(), 'A data deve ser maior que hoje.'),
  suggestedValue: z.coerce
    .number()
    .min(1, 'O valor sugerido deve ser maior que 0.'),
  suggestedValueWithDrink: z.coerce
    .number()
    .min(1, 'O valor sugerido deve ser maior que 0.'),
})

type CreateBarbecueForm = z.infer<typeof createBarbecueSchema>

export function CreateBarbecueForm({ close }: { close: () => void }) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateBarbecueForm>({
    resolver: zodResolver(createBarbecueSchema),
    defaultValues: {
      name: '',
      description: '',
      date: new Date(),
      suggestedValue: 1,
      suggestedValueWithDrink: 1,
    },
  })

  async function onSubmit(values: CreateBarbecueForm) {
    setIsLoading(true)

    try {
      const barbecue = await createBarbecue({
        name: values.name,
        description: values.description ?? null,
        date: values.date,
        suggestedValue: values.suggestedValue,
        suggestedValueWithDrink: values.suggestedValueWithDrink,
      })

      await refreshAction(
        () => router.refresh(),
        () =>
          toast({
            title: 'Churrasco cadastrado.',
            description: `${barbecue.name} foi cadastrado com sucesso!`,
          })
      )
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Oops! Aconteceu algo.',
        description: 'Teve um problema na criação, tente novamente.',
      })
    } finally {
      setIsLoading(false)
      close()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: Niver do Gui" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suggestedValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor sugerido (R$)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Valor sugerido (R$)"
                  min={1}
                  {...field}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suggestedValueWithDrink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor sugerido com bebida (R$)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Valor sugerido com bebida"
                  min={1}
                  {...field}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'pl-3 text-left font-normal w-full',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', {
                          locale: ptBR,
                        })
                      ) : (
                        <span>Escolha a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Essa será a data do churrasco.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          Salvar
        </Button>
      </form>
    </Form>
  )
}
