"use client";

import CartNav  from "./nav/cart";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LoginButton } from "@/components/auth/login-button";
import { CommandMenu } from "./nav/command";
import { MainNav } from "./nav/desktop";
import { MobileNav } from "./nav/mobile";
import { ThemeSwitcher } from "@/providers/theme-switcher";

import { useCart } from "@/hooks/use-cart";
import useFromStore from "@/hooks/useFromStore";

export const Navbar = () => {
  const cart = useFromStore(useCart, (state) => state.cart);

  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    // <nav className="supports-backdrop-blur:bg-background/90 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur mb-4 px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
    //   <div className="flex h-14 items-center">
    //     <Button
    //       asChild
    //       variant={pathname === "/server" ? "default" : "outline"}
    //     >
    //       <Link href="/server">
    //         Server
    //       </Link>
    //     </Button>
    //     <Button
    //       asChild
    //       variant={pathname === "/client" ? "default" : "outline"}
    //     >
    //       <Link href="/client">
    //         Client
    //       </Link>
    //     </Button>
    //     <Button
    //       asChild
    //       variant={pathname === "/admin" ? "default" : "outline"}
    //     >
    //       <Link href="/admin">
    //         Admin
    //       </Link>
    //     </Button>
    //     <Button
    //       asChild
    //       variant={pathname === "/settings" ? "default" : "outline"}
    //     >
    //       <Link href="/settings">
    //         Settings
    //       </Link>
    //     </Button>
    //   </div>
    //   <UserButton />
    // </nav>

    <header className="supports-backdrop-blur:bg-background/90 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur mb-4 px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
      <div className="flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <div className="flex-none">
            <CommandMenu />
          </div>
          <ThemeSwitcher />
          <CartNav />
          
          {/* <CartNav />
               <ThemeSwitcher /> */}
          {user ? (
            <UserButton />
          ) : (
            <LoginButton asChild>
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </LoginButton>
          )}
          {/* {authenticated ? <UserNav /> : <LoginDialog />} */}
        </div>
      </div>
    </header>
  );
};
