'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNavbar } from './mobilenav'
import CartNav from './cart'
import { Button } from '@/components/ui/button'
import { UserButton } from '@/components/auth/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LoginButton } from '@/components/auth/login-button'
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle'
import { APP_NAME } from '@/constants/constant'

export const Navbar = () => {
  const pathname = usePathname()
  const user = useCurrentUser()

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20 mb-4">
      <nav className="h-14 flex items-center justify-between px-4 ">
        <div className="hidden lg:block">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            {/* {APP_NAME} */}
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileNavbar />
        </div>

        <div className="flex items-center gap-4">
          <CartNav />
          <ThemeToggle />
          {user ? (
            <UserButton />
          ) : (
            <LoginButton asChild>
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </LoginButton>
          )}
        </div>
      </nav>
    </div>
  )
}
