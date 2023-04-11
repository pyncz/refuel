import { forwardRef, useMemo } from 'react'
import { ethers } from 'ethers'
import classNames from 'classnames'
import type { Optional } from '@voire/type-utils'
import type { AssetData, InputProps, WithClassName } from '../models'
import { formatThousands } from '../utils'
import { Input } from './lib'

interface Props extends InputProps {
  asset?: AssetData
}

export const AmountInput = forwardRef<HTMLInputElement, WithClassName<Props>>((props, ref) => {
  const { value, asset, className, ...attributes } = props
  const { decimals } = asset ?? {}

  const formattedValue = useMemo(() => {
    const stringValue = value?.toString() as Optional<string>
    try {
      const parsed = decimals && stringValue
        ? ethers.utils.parseUnits(stringValue, decimals)
        : stringValue
      return parsed ? formatThousands(parsed) : undefined
    } catch (e) {
      return undefined
    }
  }, [value, decimals])

  return (
    <div className="tw-relative tw-h-14">
      <Input
        {...attributes}
        ref={ref}
        value={value}
        className={classNames(
          className,
          'tw-absolute tw-h-auto !tw-items-start tw-inset-0',
          { 'tw-pb-5': !!formattedValue },
        )}
      />

      {formattedValue
        ? <small className="tw-text-dim-3 tw-text-xs tw-absolute tw-left-3 tw-top-8 tw-pointer-events-none">{formattedValue}</small>
        : null
      }
    </div>
  )
})

AmountInput.displayName = 'AmountInput'
