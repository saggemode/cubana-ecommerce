import Logo from '@/shared/Logo/Logo'
import MenuBar from '@/shared/MenuBar/MenuBar'

import Search from './_components/Header/Search'
import SiteHeaderMenu from './SiteHeaderMenu'

const SiteHeader = () => {
  return (
    <div className="nc-HeaderLogged fixed top-0 w-full z-40 ">
      <div className="nc-MainNav2Logged relative z-10 bg-white dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700">
        <div className="container ">
          <div className="h-20 flex justify-between">
            <div className="flex items-center lg:hidden flex-1">
              <MenuBar />
            </div>

            <div className="lg:flex-1 flex items-center">
              <Logo className="flex-shrink-0" />
            </div>

            <div className="flex-[2] hidden lg:flex justify-center mx-4 mt-6">
              <Search />
            </div>

            <SiteHeaderMenu />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteHeader
