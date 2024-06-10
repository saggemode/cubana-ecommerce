'use client'
import { motion } from 'framer-motion'
import NextImage from 'next/image'
import { Tab } from '@headlessui/react'
import { Image } from '@/types'
import GalleryTab from './gallery-tab'
import { ImageLoader } from '@/components/ui/image-loader'

interface GalleryProps {
  images: Image[]
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  return (
    <motion.div className="w-full sm:w-auto">
      <Tab.Group as="div" className="flex flex-col-reverse">
        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
          <Tab.List className="grid grid-cols-4 gap-6">
            {images.map((image) => (
              <GalleryTab key={image.id} image={image} />
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className="aspect-square w-full">
          {images.map((image) => (
            <Tab.Panel key={image.id}>
              <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
                <NextImage
                  fill
                  src={image.url}
                  alt="Image"
                  className="object-center object-fill"
                />
                {/* <ImageLoader
                  divStyle="h-full w-full relative shrink-0 rounded-lg sm:w-[300px] aspect-square sm:rounded-lg overflow-hidden"
                  imageStyle="!p-4"
                  src={image.url}
                  alt={'title'}
                /> */}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </motion.div>
  )
}

export default Gallery
