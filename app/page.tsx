import { HomeForm } from './_components/home-form'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { isAuthenticated } = await getCurrentUser()

  if (isAuthenticated) {
    redirect('/barbecue')
  }

  return (
    <main className="container flex-1 flex min-h-max flex-col items-center justify-between p-4 gap-4 lg:flex-row">
      <div className="flex flex-col items-center lg:items-start">
        <h1 className="mb-4 text-3xl font-extrabold text-center text-gray-900 dark:text-white md:text-5xl lg:text-6xl lg:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-primary-foreground from-primary">
            Crie seus churrascos
          </span>{' '}
          <br />
          com facilidade.
        </h1>
        <p className="text-lg max-w-md break-words font-normal text-center text-muted-foreground lg:text-left">
          No Churras Trinca você consegue organizar facilmente aquele churras
          com os seus amigos da empresa! :)
        </p>
      </div>

      <section className="h-full max-w-lg w-full">
        <div
          className={cn(
            'container mx-auto px-6 py-12 h-full flex justify-center items-center'
          )}
        >
          <div
            className={cn(
              'w-full card-foreground rounded-md border border-input px-8 py-10 shadow-lg'
            )}
          >
            <HomeForm />
          </div>
        </div>
      </section>
    </main>
  )
}
