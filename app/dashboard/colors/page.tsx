import { Button } from '@/components/ui/button'
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ColorColumn } from './_components/columns';
import { ColorClient } from './_components/client';

const page = async() => {

  const colors = await prisma.color.findMany({
  
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  )
}

export default page