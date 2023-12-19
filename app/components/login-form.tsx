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

const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido.'),
  password: z.string().min(4, 'Sua senha deve ter no minimo 4 caracteres.'),
})

type LoginValuesForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/barbecue'

  const form = useForm<LoginValuesForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginValuesForm) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)

    console.log(values)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      })
      if (res?.error) {
        const error = JSON.parse(res?.error[0])

        console.log(error)

        toast({
          variant: 'destructive',
          title: 'Oops! Aconteceu algo.',
          description:
            error?.message ?? 'Teve um problema no seu login, tente novamente.',
        })

        return
      }

      toast({
        title: 'Login realizado.',
        description: 'Bem vindo, comece a organizar seu churras!',
      })

      setIsLoading(false)
      router.push('/barbecue')
    } catch (error: any) {
      setIsLoading(false)
      toast({
        variant: 'destructive',
        title: 'Oops! Aconteceu algo.',
        description: 'Teve um problema no seu login, tente novamente.',
      })
    }
  }

  async function onSocialLogin(provider: string) {
    const res = await signIn(provider, {
      callbackUrl: `${window.location.origin}/barbecue`,
      redirect: false,
    })

    if (res?.error) {
      const error = JSON.parse(res?.error[0])

      console.log(error)

      toast({
        variant: 'destructive',
        title: 'Oops! Aconteceu algo.',
        description:
          error?.message ?? 'Teve um problema no seu login, tente novamente.',
      })

      return
    }

    toast({
      title: 'Login realizado.',
      description: 'Bem vindo, comece a organizar seu churras!',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
          Entrar
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continuar com
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => onSocialLogin('github')}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.Github className="mr-2 h-4 w-4" />
          )}{' '}
          Github
        </Button>
      </form>
    </Form>
  )
}
