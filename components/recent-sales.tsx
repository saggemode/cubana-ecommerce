import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

export function RecentSales({ name, email, amount, image, order }: any) {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={image} alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="font-medium">{amount}</div>
          {/* <p className="ml-auto">hello</p> */}
          <Link href={`/order/${order}`}>
            <Button className="px-1 py-0.5 text-xs">View</Button>
          </Link>
        </div>
      </div>
      <hr />
    </div>
  )
}
