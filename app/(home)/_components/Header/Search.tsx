
import ProductService from '@/actions/services/productService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { SearchIcon } from 'lucide-react'

export default async function Search() {
  const categories = await ProductService.getCategories()

  const filteredCategories = categories.filter(
    (c): c is string => c !== undefined
  )

  console.log(filteredCategories)

  return (
    <>
      <form action="/products" method="GET">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Select name="category">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={'All'} value={'all'}>
                All
              </SelectItem>
              {filteredCategories.map((c: string) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            name="q"
            type="text"
            placeholder="Search..."
            className="md:w-[100px] lg:w-[300px]"
          />
          <Button>
            <SearchIcon />
          </Button>
        </div>
      </form>
    </>
  )
}
