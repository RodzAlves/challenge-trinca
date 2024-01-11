import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { buttonVariants } from '@/components/ui/button'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { LinkedInLogoIcon } from '@radix-ui/react-icons'
import { getCurrentUser } from '@/lib/auth'
import { UserNav } from './user-nav'

export async function SiteHeader() {
  const { isAuthenticated } = await getCurrentUser()

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                })}
              >
                <LinkedInLogoIcon className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </div>
            </Link>
            <ThemeToggle />

            {isAuthenticated && <UserNav />}
          </nav>
        </div>
      </div>
    </header>
  )
}
