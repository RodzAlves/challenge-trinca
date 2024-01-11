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
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'
import { createUser } from '@/actions/user'

const formSchema = z.object({
  email: z.string().email('Digite um e-mail válido.'),
  password: z.string().min(4, 'Sua senha deve ter no minimo 4 caracteres.'),
})

type ValuesForm = z.infer<typeof formSchema>

export function HomeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<ValuesForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: ValuesForm) {
    setIsLoading(true)

    try {
      if (!isLogin) {
        const user = await createUser({
          email: values.email,
          password: values.password,
        })

        if (user?.error) {
          toast({
            variant: 'destructive',
            title: 'Oops! Aconteceu algo.',
            description:
              user?.error ??
              'Teve um problema no seu cadastro, tente novamente.',
          })

          return
        }
      }

      const response = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (response && !response?.ok) {
        toast({
          variant: 'destructive',
          title: 'Oops! Aconteceu algo.',
          description: 'Teve um problema no seu login, tente novamente.',
        })

        return
      }

      router.refresh()

      toast({
        title: 'Login realizado.',
        description: 'Bem vindo, comece a organizar seu churras!',
      })

      router.push('/barbecue')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Oops! Aconteceu algo.',
        description:
          error?.message ?? 'Teve um problema no seu login, tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <span className="text-xl text-center font-bold mt-6">
          {isLogin ? 'Faça seu login' : 'Conclua seu cadastro'}
        </span>

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite sua senha"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </Button>

        <div className="flex flex-col items-center justify-center">
          <h4 className="text-center text-sm font-semibold text-muted-foreground">
            {isLogin ? 'Não possui conta?' : 'Já possui conta?'}
          </h4>

          <Button
            type="button"
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin ? 'Cadastrar' : 'Logar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
