
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately
    checkMobile()
    
    // Add resize listener with debounce for better performance
    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return !!isMobile
}

// Additional utility to get screen size category
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')
  
  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize('xs')
      else if (width < 768) setScreenSize('sm')
      else if (width < 1024) setScreenSize('md')
      else if (width < 1280) setScreenSize('lg')
      else setScreenSize('xl')
    }
    
    updateScreenSize()
    
    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateScreenSize, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])
  
  return screenSize
}
