import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import * as Label from '@radix-ui/react-label'
import type { MaybePromise, OmitListeners } from '@voire/type-utils'
import classNames from 'classnames'
import type { WithClassName } from '../../../models'
import { useUncontrolledValue } from '../../../hooks'

interface Props extends OmitListeners<InputHTMLAttributes<HTMLInputElement>> {
  label?: string
  onChange?: (value: string) => MaybePromise<void>
  onBlur?: () => MaybePromise<void>
}

export const Input = forwardRef<HTMLInputElement, WithClassName<Props>>((props, ref) => {
  const {
    label,
    className,
    value,
    defaultValue,
    onChange,
    ...attributes
  } = props
  const { id } = attributes

  const [localValue, setLocalValue] = useUncontrolledValue(value, defaultValue ?? '')

  return (
    <>
      {label
        ? <Label.Root htmlFor={id}>{label}</Label.Root>
        : null
      }
      <input
        {...attributes}
        ref={ref}
        value={localValue}
        className={classNames('tw-input tw-truncate', className)}
        onChange={(e) => {
          setLocalValue(e.target.value)
          onChange?.(e.target.value)
        }}
      />
    </>
  )
})

Input.displayName = 'Input'
