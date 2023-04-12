import type { FC, PropsWithChildren } from 'react'
import type { AssetData } from '../models'
import { TokenSymbol } from './TokenSymbol'

interface Props {
  asset?: AssetData
}

export const TokenData: FC<PropsWithChildren<Props>> = (props) => {
  const { children, asset } = props

  return (
    <div className="tw-grid tw-items-center tw-gap-4 tw-grid-cols-[3fr_2fr] xs:tw-grid-cols-[2fr_1fr] sm:tw-grid-cols-[3fr_1fr]">
      {children}
      {asset ? <TokenSymbol {...asset} /> : null}
    </div>
  )
}
