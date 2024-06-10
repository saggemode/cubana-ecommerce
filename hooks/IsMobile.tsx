import { useEffect, useState } from 'react'
import { useWindowSize } from './useWindowSize'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [width] = useWindowSize()

  useEffect(() => {
    setIsMobile(width < 768)
  }, [width])

  return isMobile
}

export default useIsMobile
