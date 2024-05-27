"use client";

import { ExitIcon } from "@radix-ui/react-icons";

import {
  LuCreditCard,
  LuHeart,
  LuShoppingBasket,
  LuListOrdered,
  LuLogOut,
  LuMapPin,
  LuUser,
} from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
           
            {user?.name?.[0].toUpperCase() ||
              user?.email?.[0] ||
              `<FaUser className="text-white" /> `}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup>
          {/* <Link href="/profile/addresses">
            <DropdownMenuItem className="flex gap-2">
              <MapPinIcon className="h-4" />
              Edit Addresses
            </DropdownMenuItem>
          </Link> */}
          <Link href="/profile/edit">
            <DropdownMenuItem className="flex gap-2">
              <LuUser className="h-4" />
              Edit Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/profile/orders">
            <DropdownMenuItem className="flex gap-2">
              <LuListOrdered className="h-4" />
              Orders
            </DropdownMenuItem>
          </Link>
          <Link href="/profile/payments">
            <DropdownMenuItem className="flex gap-2">
              <LuCreditCard className="h-4" />
              Payments
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link href="/cart">
            <DropdownMenuItem className="flex gap-2">
              <LuShoppingBasket className="h-4" /> Cart
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard">
            <DropdownMenuItem className="flex gap-2">
              <LuHeart className="h-4" /> Dashboard
            </DropdownMenuItem>
          </Link>
          <Link href="/admin">
            <DropdownMenuItem className="flex gap-2">
              <LuHeart className="h-4" /> Admin
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
