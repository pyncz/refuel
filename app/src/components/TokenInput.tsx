import { forwardRef } from 'react'
import classNames from 'classnames'
import type { AssetData, InputProps, WithClassName } from '../models'
import { formatAddress } from '../utils'
import { OverlayInput } from './OverlayInput'
import { TokenSymbol } from './TokenSymbol'

interface Props extends InputProps {
  asset?: AssetData
}

export const TokenInput = forwardRef<HTMLInputElement, WithClassName<Props>>((props, ref) => {
  const { asset, value, ...attributes } = props

  return (
    <OverlayInput {...attributes} value={value} ref={ref}>
      {asset
        ? (
          <div className="tw-absolute tw-flex-center-y tw-inset-0 tw-px-ui tw-py-ui">
            <TokenSymbol {...asset} className={classNames('tw-absolute', value ? 'tw-top-3' : 'tw-top-5')} />
            {value
              ? <small className="tw-absolute tw-top-8 tw-text-dim-3 tw-text-xs tw-truncate tw-leading-1">{formatAddress(value.toString())}</small>
              : null
            }
          </div>
          )
        : null
      }
    </OverlayInput>
  )
})

TokenInput.displayName = 'TokenInput'
