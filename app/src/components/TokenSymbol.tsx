import type { FC } from 'react'
import classNames from 'classnames'
import type { AssetData, WithClassName } from '../models'

type Props = AssetData

export const TokenSymbol: FC<WithClassName<Props>> = (props) => {
  const { symbol, name, className } = props

  return (
    <div title={name} className={classNames('tw-font-mono', className)}>
      {symbol}
    </div>
  )
}
