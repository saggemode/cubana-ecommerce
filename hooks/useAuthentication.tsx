'use client'

import { validateBoolean } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function useAuthenticated() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cookies = document.cookie.split(';')
        const loggedInCookie = cookies.find((cookie) =>
          cookie.trim().startsWith('logged-in')
        )

        if (loggedInCookie) {
          const isLoggedIn = loggedInCookie.split('=')[1] === 'true'
          setAuthenticated(isLoggedIn)
        } else {
          setAuthenticated(false)
        }
      }
    } catch (error) {
      console.error({ error })
      setAuthenticated(false) // Fallback to false in case of error
    }
  }, [])

  return { authenticated: validateBoolean(authenticated, true) }
}
