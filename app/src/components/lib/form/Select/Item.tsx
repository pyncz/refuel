import * as RadixSelect from '@radix-ui/react-select'
import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import classNames from 'classnames'
import type { WithClassName } from '../../../../models'

interface Props<
  TOption = unknown,
  TValue extends string = string,
> {
  option: TOption
  value: TValue
  render?: (option: TOption, options: {
    selected: boolean
  }) => ReactNode
  textValue?: string
  disabled?: boolean
  selected?: boolean
}

export const SelectItem = forwardRef<HTMLDivElement, WithClassName<Props>>((props, ref) => {
  const {
    option,
    render,
    className,
    selected = false,
    ...attributes
  } = props
  const { value } = attributes

  return (
    <RadixSelect.Item
      ref={ref}
      {...attributes}
      className={classNames(
        'tw-group/option',
        'tw-truncate tw-flex-center-y tw-text-ellipsis tw-rounded tw-px-2 tw-h-ui tw-cursor-pointer tw-duration-fast',
        'tw-bg-[rgba(var(--select-option-bg),_var(--tw-bg-opacity))] tw-bg-opacity-[var(--o-select-option-bg)] tw-text-[rgba(var(--select-option-text),_var(--tw-text-opacity))]',
        'hover:tw-bg-[rgba(var(--select-option-bg--hover),_var(--tw-bg-opacity))] hover:tw-bg-opacity-[var(--o-select-option-bg--hover)] hover:tw-text-[rgba(var(--select-option-text--hover),_var(--tw-text-opacity))] data-highlighted:tw-text-[rgba(var(--select-option-text--highlighted),_var(--tw-text-opacity))] data-highlighted:tw-underline',
        'checked:tw-text-[rgba(var(--select-option-checked-text),_var(--tw-text-opacity))] checked:data-highlighted:tw-text-[rgba(var(--select-option-checked-text--hover),_var(--tw-text-opacity))] checked:tw-bg-[rgba(var(--select-option-checked-bg),_var(--tw-bg-opacity))] checked:tw-bg-opacity-[var(--o-select-option-checked-bg)]',
        'disabled:tw-pointer-events-none data-disabled:tw-pointer-events-none disabled:tw-text-[rgba(var(--select-option-disabled-text),_var(--tw-text-opacity))] data-disabled:tw-text-[rgba(var(--select-option-disabled-text),_var(--tw-text-opacity))] disabled:tw-opacity-muted data-disabled:tw-opacity-muted',
        className,
      )}
    >
      <RadixSelect.ItemText>
        {render?.(option, { selected }) ?? value}
      </RadixSelect.ItemText>
    </RadixSelect.Item>
  )
})

SelectItem.displayName = 'SelectItem'
