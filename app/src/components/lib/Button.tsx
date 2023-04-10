import { forwardRef } from 'react'
import classNames from 'classnames'
import type { ButtonProps, WithClassName } from '../../models'

export const Button = forwardRef<HTMLButtonElement, WithClassName<ButtonProps>>((props, ref) => {
  const {
    children,
    appearance = 'primary',
    icon = null,
    iconLeft = null,
    iconRight = null,
    className,
    ...attributes
  } = props

  const noContent = !(children || iconLeft || iconRight)

  return (
    <div className={className}>
      <button
        ref={ref}
        {...attributes}
        className={classNames(
          'tw-button tw--mx-0.5',
          {
            'tw-button-icon': noContent,
            'tw-button-primary': appearance === 'primary',
            'tw-button-secondary': appearance === 'secondary',
          },
        )}
      >
        {icon ?? (
          <>
            {iconLeft}
            {children}
            {iconRight}
          </>
        )}
      </button>
    </div>
  )
})

Button.displayName = 'Button'
