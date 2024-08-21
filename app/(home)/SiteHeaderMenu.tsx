import React from 'react'
import CartDropdown from './_components/Header/CartDropdown'
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle'
import SiteHeaderUserButton from './SiteHeaderUserButton'

const SiteHeaderMenu = () => {
  return (
    <>
      <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
        <SiteHeaderUserButton />
        <CartDropdown />
        <ThemeToggle />
      </div>
    </>
  )
}

export default SiteHeaderMenu
