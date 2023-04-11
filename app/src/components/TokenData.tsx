import type { FC, PropsWithChildren } from 'react'
import type { AssetData } from '../models'

type Props = Partial<AssetData>

export const TokenData: FC<PropsWithChildren<Props>> = (props) => {
  const { children, symbol, name } = props

  return (
    <div className="tw-grid tw-items-center tw-gap-4 tw-grid-cols-[3fr_2fr] xs:tw-grid-cols-[2fr_1fr] sm:tw-grid-cols-[3fr_1fr]">
      {children}
      {symbol
        ? <div title={name} className="tw-font-mono tw-text-dim-3">{symbol}</div>
        : null
      }
    </div>
  )
}
