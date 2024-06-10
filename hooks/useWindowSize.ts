import { useState, useEffect } from 'react'

export type WindowSize = [number, number]

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize]: [
    WindowSize,
    React.Dispatch<React.SetStateAction<WindowSize>>
  ] = useState(() =>
    typeof window !== 'undefined'
      ? [window.innerWidth, window.innerHeight]
      : [0, 0]
  )

  useEffect(() => {
    const handleResize = (): void =>
      setWindowSize([window.innerWidth, window.innerHeight])

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}
