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
import { cn, formatCurrency } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { Barbecue } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createParticipant } from '@/actions/participant'
import { refreshAction } from '@/utils/refresh-action'

const newParticipantSchema = z.object({
  name: z.string().min(4, 'O nome deve ter no minimo 4 caracteres.'),
  email: z.string().email('Digite um e-mail válido.'),
  amount: z.coerce.number().min(1, 'O valor deve ser maior que 0.'),
})

type NewParticipantForm = z.infer<typeof newParticipantSchema>

type NewParticipantFormProps = {
  close: () => void
  barbecue: Barbecue
}

export function NewParticipantForm({
  close,
  barbecue,
}: NewParticipantFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isOtherSuggestedValue, setIsOtherSuggestedValue] = useState(false)

  const form = useForm<NewParticipantForm>({
    resolver: zodResolver(newParticipantSchema),
    defaultValues: {
      name: '',
      email: '',
      amount: Number(barbecue.suggestedValue),
    },
  })

  async function onSubmit(values: NewParticipantForm) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)

    try {
      const response = await createParticipant({
        email: values.email,
        name: values.name,
        amount: values.amount,
        barbecueId: barbecue.id,
        isPaid: false,
      })

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
            title: 'Participante cadastrado.',
            description: `${values.name} foi cadastrado com sucesso no churras ${barbecue.name}!`,
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
      setIsOtherSuggestedValue(false)
      close()
    }
  }

  function handleChangeSuggestedValue(value: string) {
    if (value === 'other') {
      setIsOtherSuggestedValue(true)
      return
    }

    if (isOtherSuggestedValue) {
      setIsOtherSuggestedValue(false)
    }

    form.setValue('amount', Number(value))
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
                <Input placeholder="Exemplo: Paulo Alves" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="space-y-3">
          <FormLabel>Valor de contribuição</FormLabel>

          <FormControl>
            <RadioGroup
              onValueChange={handleChangeSuggestedValue}
              defaultValue={String(barbecue.suggestedValue)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={String(barbecue.suggestedValue)}
                  id="suggestedValue"
                />
                <Label htmlFor="suggestedValue">
                  {formatCurrency(Number(barbecue.suggestedValue))} - Sem bebida
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={String(barbecue.suggestedValueWithDrink)}
                  id="suggestedValueWithDrink"
                />
                <Label htmlFor="suggestedValueWithDrink">
                  {formatCurrency(Number(barbecue.suggestedValueWithDrink))} -
                  Com bebida
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Outro</Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>

        {isOtherSuggestedValue && (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Digite um valor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Valor (R$)"
                    min={1}
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          Salvar
        </Button>
      </form>
    </Form>
  )
}
