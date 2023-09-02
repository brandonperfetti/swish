import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const debouncedTimer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(debouncedTimer)
    }
  }, [value, delay])

  return debouncedValue
}
