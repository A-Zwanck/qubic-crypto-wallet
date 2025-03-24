
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with correct value when running in browser
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    // Default to false for SSR
    return false
  })

  React.useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add resize listener with debounce for better performance
    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    // Handle device orientation change in mobile devices
    window.addEventListener("orientationchange", checkMobile)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", checkMobile)
      clearTimeout(timeoutId)
    }
  }, [])

  return isMobile
}

// Additional utility to get screen size category
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>(() => {
    // Initialize with correct value when running in browser
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width < 640) return 'xs'
      else if (width < 768) return 'sm'
      else if (width < 1024) return 'md'
      else if (width < 1280) return 'lg'
      else return 'xl'
    }
    // Default to 'md' for SSR
    return 'md'
  })
  
  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize('xs')
      else if (width < 768) setScreenSize('sm')
      else if (width < 1024) setScreenSize('md')
      else if (width < 1280) setScreenSize('lg')
      else setScreenSize('xl')
    }
    
    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateScreenSize, 100)
    }
    
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", updateScreenSize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", updateScreenSize)
      clearTimeout(timeoutId)
    }
  }, [])
  
  return screenSize
}
