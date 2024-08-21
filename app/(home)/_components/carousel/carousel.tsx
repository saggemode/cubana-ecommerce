'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  Carousel as SCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Product } from '@/types'

const Carousel = ({ data }: { data: Product[] }) => {
  return (
    <SCarousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 6000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent className="pt-24">
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <div className="w-full overflow-hidden rounded-lg h-96">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.images[0].url!}
                  className="h-[304px] w-full object-cover lg:h-[536px]"
                  width={1500}
                  height={300}
                  alt={product.name}
                  blurDataURL={product.images[0].url!}
                  placeholder="blur"
                  sizes="(max-width: 1500px) 100vw, 1500px"
                  priority
                />
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2" />
      <CarouselNext className="absolute right-4 top-1/2" />
    </SCarousel>
  )
}

export default Carousel

export const CarouselSkeleton = () => {
  return <div className="skeleton h-[304px] w-full rounded-lg lg:h-[536px]" />
}
