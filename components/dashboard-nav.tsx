"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { NavItem } from "@/types";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();

   const [openIndexes, setOpenIndexes] = useState<number[]>([])

   const toggleOpen = (index: number) => {
     if (openIndexes.includes(index)) {
       setOpenIndexes(openIndexes.filter((i) => i !== index))
     } else {
       setOpenIndexes([...openIndexes, index])
     }
   }

  if (!items?.length) {
    return null;
  }

  return (
    
    <nav className="grid items-start gap-2 h-full overflow-y-auto">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || 'arrowRight']
        const isActive = path === item.href

        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? '/' : item.href}
              onClick={() => {
                if (setOpen) setOpen(false)
              }}
              className={cn(
                'group relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground',
                item.disabled && 'cursor-not-allowed opacity-80'
              )}
            >
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-accent-foreground rounded"></span>
              )}
              <Icon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span className="relative">
                {item.title}
                {/* Tooltip */}
                <span className="absolute left-full ml-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.title}
                </span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
