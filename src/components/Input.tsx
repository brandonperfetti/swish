import clsx from 'clsx'
import { ElementType, ForwardedRef, forwardRef } from 'react'
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef
  // @ts-ignore this package needs updated types
} from 'react-polymorphic-types'
import { Spinner } from './Spinner'

const defaultElement = 'input'

export interface InputProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  leftIcon?: JSX.Element
  rightIcon?: JSX.Element
  placeholder?: string
  loading?: boolean
  disabled?: boolean
  readOnly?: boolean
  fullWidth?: boolean
}

export const Input: PolymorphicForwardRefExoticComponent<
  InputProps,
  typeof defaultElement
> = forwardRef(function Input<T extends ElementType = typeof defaultElement>(
  {
    as,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    disabled,
    loading,
    readOnly,
    fullWidth,
    ...props
  }: PolymorphicPropsWithoutRef<InputProps, T>,
  ref: ForwardedRef<Element>
) {
  if (props.className) {
    throw new Error('You cannot add classnames to the input')
  }

  const Element: ElementType = as || defaultElement

  return (
    <div className={clsx('relative', { 'w-full': fullWidth })}>
      {!!leftIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="h-5 w-5 text-gray-500" aria-hidden>
            {leftIcon}
          </div>
        </div>
      )}
      <Element
        ref={ref}
        type="text"
        {...props}
        readOnly={readOnly}
        disabled={disabled}
        className={clsx(
          'block w-full appearance-none border p-2 shadow-sm focus:outline-none focus:ring-0',
          {
            'border-gray-300': variant === 'primary',
            'focus:border-indigo-200':
              variant === 'primary' && !disabled && !readOnly,

            'border-red-300': variant === 'danger',
            'focus:border-red-500':
              variant === 'danger' && !disabled && !readOnly,

            'cursor-not-allowed bg-gray-50': disabled,
            'cursor-default bg-gray-50': readOnly,

            'pl-10': !!leftIcon,
            'pr-10': !!rightIcon,

            'rounded p-2 text-xs': size === 'xs',
            'rounded-md p-2 text-sm leading-4': size === 'sm',
            'rounded-md p-2 text-base sm:text-sm': size === 'md',
            'rounded-md p-2 text-base': size === 'lg',
            'rounded-md p-3 text-base': size === 'xl',
            'rounded-md p-3 text-xl': size === '2xl',
            'rounded-md p-4 text-2xl': size === '3xl'
          }
        )}
      />
      {loading && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="h-5 w-5 text-gray-500" aria-hidden>
            <Spinner />
          </div>
        </div>
      )}
      {!!rightIcon && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="h-5 w-5 text-gray-500" aria-hidden>
            {rightIcon}
          </div>
        </div>
      )}
    </div>
  )
})
