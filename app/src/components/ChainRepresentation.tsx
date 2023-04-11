import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'next-i18next'
import classNames from 'classnames'
import { Icon } from '@iconify-icon/react'
import chainIcon from '@iconify/icons-ion/cube-outline'
import Image from 'next/image'
import { getChainLogo } from '../utils'
import type { WithClassName } from '../models'
import { useChain } from '../hooks'
import { Representation } from './Representation'

interface Props {
  chainId: number
}

export const ChainRepresentation: FC<WithClassName<Props>> = (props) => {
  const { chainId, className } = props
  const { i18n } = useTranslation()

  const chain = useChain(chainId)

  const chainName = useMemo(() => chain?.name ?? chainId.toString(), [chain, chainId])
  const chainTitle = useMemo(() => i18n.t('chainName', { name: chainName }), [i18n, chainName])

  const logo = useMemo(() => getChainLogo(chainId), [chainId])

  return (
    <Representation
      title={chainTitle}
      className={classNames('tw-font-mono', className)}
      label={chainName}
      image={(
        <div className="tw-circle-[2em] tw-relative tw-bg-dim-2 tw-flex-center">
          {logo
            ? (
              <div className="tw-absolute tw-inset-[0.375em]">
                <Image
                  alt={i18n.t('logo', { name: chainTitle })}
                  src={logo}
                  fill
                />
              </div>
              )
            : <Icon icon={chainIcon} className="tw-text-dim-2 tw-text-normal" />
          }
        </div>
      )}
    />
  )
}
