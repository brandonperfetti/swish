import { ShortcutIcon } from '@/icons/ShortcutIcon'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChangeEvent, useEffect, useRef } from 'react'
import { Input } from './Input'

interface SearchFilterInputProps {
  value: string
  placeholder: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const SearchFilterInput = ({
  value,
  placeholder,
  onChange
}: SearchFilterInputProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyPress(event: KeyboardEvent) {
      if (
        event.key === '/' &&
        document.activeElement !== searchInputRef.current
      ) {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.body.addEventListener('keydown', onKeyPress)
    return () => {
      document.body.removeEventListener('keydown', onKeyPress)
    }
  }, [])

  return (
    <Input
      ref={searchInputRef}
      aria-label="search"
      leftIcon={<MagnifyingGlassIcon />}
      rightIcon={<ShortcutIcon className="text-gray-700" />}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}
