import { useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'next-i18next'
import { useNetwork } from 'wagmi'
import classNames from 'classnames'
import { Icon } from '@iconify-icon/react'
import chainIcon from '@iconify/icons-ion/cube-outline'
import Image from 'next/image'
import { getChainLogo } from '../utils'
import type { WithClassName } from '../models'
import { Representation } from './Representation'

interface Props {
  chainId: number
}

export const ChainRepresentation: FC<WithClassName<Props>> = (props) => {
  const { chainId, className } = props

  const { i18n } = useTranslation()

  const { chains } = useNetwork()
  const chain = useMemo(() => chains.find(c => c.id === chainId), [chains, chainId])

  const chainName = useMemo(() => chain?.name ?? chainId.toString(), [chain, chainId])
  const chainTitle = useMemo(() => i18n.t('chainName', { name: chainName }), [i18n, chainName])

  const logo = useMemo(() => getChainLogo(chainId), [chainId])

  return (
    <Representation
      title={chainTitle}
      className={classNames('tw-font-mono', className)}
      label={chainName}
      image={(
        <div className="tw-circle-8 tw-relative tw-bg-dim-2 tw-flex-center">
          {logo
            ? (
              <div className="tw-absolute tw-inset-1.5">
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
