import clsx from 'clsx'
import { ElementType, ForwardedRef, forwardRef } from 'react'
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef
  // @ts-ignore this package needs updated types
} from 'react-polymorphic-types'
import { Spinner } from './Spinner'

const defaultElement = 'button'

interface OwnButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tertiary-danger' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  leftIcon?: JSX.Element
  rightIcon?: JSX.Element
  outline?: boolean
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
}

export type ButtonProps<T extends ElementType = typeof defaultElement> =
  PolymorphicPropsWithoutRef<OwnButtonProps, T>

export const Button: PolymorphicForwardRefExoticComponent<
  OwnButtonProps,
  typeof defaultElement
> = forwardRef(function Button<T extends ElementType = typeof defaultElement>(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    outline,
    fullWidth,
    loading,
    disabled,
    children,
    as,
    ...props
  }: ButtonProps<T>,
  ref: ForwardedRef<Element>
) {
  if (props.className) {
    throw new Error('You cannot add classnames to the button')
  }

  const isDisabled = disabled || loading
  const Element: ElementType = as || defaultElement

  return (
    <Element
      {...props}
      ref={ref}
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center border font-medium capitalize shadow-sm focus:outline-none',
        {
          // Variants
          // When creating a new variant, base it off of the primary variant.

          // Primary
          // Solid
          'border-transparent bg-indigo-400 text-white':
            variant === 'primary' && !outline,
          'hover:border-transparent hover:bg-indigo-400 focus:bg-indigo-400 active:border-transparent active:bg-indigo-600':
            variant === 'primary' && !outline && !isDisabled,
          // Primary
          // Outline
          'border-indigo-400 text-indigo-400': variant === 'primary' && outline,
          'hover:border-indigo-400 hover:text-indigo-400 focus:border-indigo-400 focus:text-indigo-400 active:border-indigo-600 active:text-indigo-600':
            variant === 'primary' && outline && !isDisabled,

          // Secondary
          // Solid
          'border-transparent bg-gray-200 text-gray-900':
            variant === 'secondary' && !outline,
          'hover:border-transparent hover:bg-gray-300 focus:bg-gray-300 active:border-transparent active:bg-gray-400':
            variant === 'secondary' && !outline && !isDisabled,

          // Secondary
          // Outline
          'border-gray-300 text-gray-900': variant === 'secondary' && outline,
          'hover:border-gray-200 focus:border-gray-200 active:border-gray-300':
            variant === 'secondary' && outline && !isDisabled,

          // Tertiary
          // Solid
          'border-transparent bg-gray-100 text-indigo-400':
            variant === 'tertiary' && !outline,
          'hover:border-transparent hover:text-indigo-400 focus:text-indigo-400 active:border-transparent active:text-indigo-400':
            variant === 'tertiary' && !outline && !isDisabled,

          // Tertiary
          // Outline
          'border-gray-200 text-indigo-400': variant === 'tertiary' && outline,
          'hover:text-indigo-400 focus:text-indigo-400 active:text-indigo-400':
            variant === 'tertiary' && outline && !isDisabled,

          // Tertiary Danger
          // Solid
          'border-transparent bg-gray-100 text-red-500':
            variant === 'tertiary-danger' && !outline,
          'hover:border-transparent hover:text-red-400 focus:text-red-400 active:border-transparent active:text-red-500':
            variant === 'tertiary-danger' && !outline && !isDisabled,

          // Tertiary Danger
          // Outline
          'border-gray-200 text-red-500':
            variant === 'tertiary-danger' && outline,
          'hover:text-red-400 focus:text-red-400 active:text-red-500':
            variant === 'tertiary-danger' && outline && !isDisabled,

          // Danger
          // Solid
          'border-transparent bg-red-500 text-white':
            variant === 'danger' && !outline,
          'hover:border-transparent hover:bg-red-400 focus:bg-red-400 active:border-transparent active:bg-red-700':
            variant === 'danger' && !outline && !isDisabled,

          // Danger
          // Outline
          'border-red-500 text-red-500': variant === 'danger' && outline,
          'hover:border-red-400 hover:text-red-400 focus:border-red-400 focus:text-red-400 active:border-red-600 active:text-red-600':
            variant === 'danger' && outline && !isDisabled,

          // Size
          'rounded px-2.5 py-1.5 text-xs': size === 'xs',
          'rounded-md px-3 py-2 text-sm leading-4': size === 'sm',
          'rounded-md px-4 py-2 text-base sm:text-sm': size === 'md',
          'rounded-md px-4 py-2 text-base': size === 'lg',
          'rounded-md px-6 py-3 text-base': size === 'xl',

          // Width
          'w-full': fullWidth,

          // Disabled
          'cursor-pointer': !isDisabled,
          'cursor-not-allowed opacity-50': isDisabled
        }
      )}>
      {!leftIcon && !rightIcon && loading && (
        <span
          className={clsx('mr-2 -ml-1 flex-shrink-0', {
            'h-4 w-4': ['xs', 'sm'].includes(size),
            'h-5 w-5': ['md', 'lg', 'xl'].includes(size)
          })}>
          <Spinner />
        </span>
      )}
      {leftIcon && (
        <span
          className={clsx('mr-2 -ml-1 flex-shrink-0', {
            'h-4 w-4': ['xs', 'sm'].includes(size),
            'h-5 w-5': ['md', 'lg', 'xl'].includes(size)
          })}>
          {loading ? <Spinner /> : leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span
          className={clsx('ml-2 -mr-1 flex-shrink-0', {
            'h-4 w-4': ['xs', 'sm'].includes(size),
            'h-5 w-5': ['md', 'lg', 'xl'].includes(size)
          })}>
          {loading ? <Spinner /> : rightIcon}
        </span>
      )}
    </Element>
  )
})
