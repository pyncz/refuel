import { forwardRef } from 'react'
import classNames from 'classnames'
import type { AssetData, InputProps, WithClassName } from '../models'
import { TokenSymbol } from './TokenSymbol'
import { SubtitledInput } from './SubtitledInput'

interface Props extends InputProps {
  subtitle?: string | ((value?: string | number | bigint) => string)
  asset?: AssetData
}

export const AmountInput = forwardRef<HTMLInputElement, WithClassName<Props>>((props, ref) => {
  const { asset, className, ...attributes } = props

  return (
    <SubtitledInput
      {...attributes}
      ref={ref}
      className={classNames(
        className,
        { 'tw-pr-12': !!asset },
      )}
    >
      {asset
        ? <TokenSymbol {...asset} className="tw-absolute tw-right-3 tw-top-[13px] tw-pointer-events-none" />
        : null
      }
    </SubtitledInput>
  )
})

AmountInput.displayName = 'AmountInput'
