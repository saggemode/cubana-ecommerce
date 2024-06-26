import { useState, MouseEventHandler } from 'react'

import Image from 'next/image'
import cn from 'clsx'
import type { ReactNode } from 'react'

type ImageLoaderProps = {
  src: string
  alt: string
  divStyle: string
  imageStyle?: string
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  draggable?: boolean
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLImageElement>
}

export function ImageLoader({
  src,
  alt,
  divStyle,
  children,
  objectFit,
  draggable,
  imageStyle,
  onClick,
}: ImageLoaderProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = (): void => setIsLoading(false)

  return (
    <div
      className={cn(
        'relative',
        divStyle,
        isLoading && 'animate-pulse !bg-primary'
      )}
    >
      <Image
        className={imageStyle}
        src={src}
        alt={alt}
        draggable={draggable}
        objectFit={objectFit}
        layout="fill"
        onClick={onClick}
        onLoadingComplete={handleLoad}
      />
      {children}
    </div>
  )
}
