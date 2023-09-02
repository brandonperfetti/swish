import clsx from 'clsx'

function getInitials(name?: string) {
  if (!name) return ''
  const splitName = name.split(' ')
  const firstName = splitName[0]
  const lastName = splitName[splitName.length - 1]
  if (splitName.length === 1) return firstName[0]?.toUpperCase()
  return [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase()
}

interface AvatarProps {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  outline?: boolean
}

export function Avatar({ src, name, size = 'md', outline }: AvatarProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center overflow-hidden rounded-full bg-indigo-400 align-middle font-normal leading-none text-white',
        {
          'h-6 w-6 text-xs': size === 'xs',
          'h-8 w-8 text-sm': size === 'sm',
          'h-10 w-10 text-base': size === 'md',
          'h-12 w-12 text-lg': size === 'lg',
          'h-14 w-14 text-xl': size === 'xl',
          'h-20 w-20 text-2xl': size === '2xl',
          'h-20 w-20 text-3xl': size === '3xl',
          'h-32 w-32 text-4xl': size === '4xl',

          'ring-2 ring-white': outline
        }
      )}>
      {!!src && (
        <img
          src={src}
          alt={name ?? 'Avatar'}
          className="object-cover w-full h-full"
        />
      )}
      {!src && !name && (
        <svg
          className="w-full h-full text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
      {!src && !!name && getInitials(name)}
    </div>
  )
}
