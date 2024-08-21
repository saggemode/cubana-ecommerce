import { auth } from '@/auth'
import React from 'react'
import AvatarDropdown from './_components/Header/AvatarDropdown'
import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/auth/login-button'

export default async function SiteHeaderUserButton() {
  const session = await auth()
  return (
    <div>
      {session ? (
        <AvatarDropdown />
      ) : (
        <LoginButton asChild>
          <Button variant="secondary" size="lg">
            Sign In
          </Button>
        </LoginButton>
      )}
    </div>
  )
}
