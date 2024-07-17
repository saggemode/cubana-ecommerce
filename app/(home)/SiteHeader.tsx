'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
//import HeaderLogged from '@/components/Header/HeaderLogged'
// import Header from '@/components/Header/Header'
import { useThemeMode } from '@/hooks/useThemeMode'
import HeaderLogged from './_components/Header/HeaderLogged'

const SiteHeader = () => {
  useThemeMode()

  let pathname = usePathname()

  return pathname === '/home-2' ? <HeaderLogged /> : <HeaderLogged />
}

export default SiteHeader
