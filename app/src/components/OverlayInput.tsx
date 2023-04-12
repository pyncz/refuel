import type { PropsWithChildren } from 'react'
import { forwardRef } from 'react'
import classNames from 'classnames'
import type { InputProps, WithClassName } from '../models'
import { Input } from './lib'

export const OverlayInput = forwardRef<HTMLInputElement, PropsWithChildren<WithClassName<InputProps>>>((props, ref) => {
  const { className, children, ...attributes } = props

  return (
    <div className="tw-relative tw-h-14 tw-group/input">
      <Input
        {...attributes}
        ref={ref}
        className={classNames(
          className,
          'tw-absolute tw-h-auto tw-inset-0',
          { 'tw-text-opacity-0 group-focus/input:tw-text-opacity-full group-focus-within/input:tw-text-opacity-full': children },
        )}
      />

      {children
        ? (
          <div className="tw-absolute tw-inset-0 tw-duration-normal tw-pointer-events-none group-focus/input:tw-opacity-0 group-focus-within/input:tw-opacity-0">
            {children}
          </div>
          )
        : null
       }
    </div>
  )
})

OverlayInput.displayName = 'OverlayInput'
