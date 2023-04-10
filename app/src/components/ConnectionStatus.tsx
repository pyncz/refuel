import type { FC } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useMemo } from 'react'
import { Icon } from '@iconify-icon/react'
import walletIcon from '@iconify/icons-ion/wallet-outline'
import Image from 'next/image'
import classNames from 'classnames'
import { formatAddress } from '../utils'
import type { WithClassName } from '../models'
import { Button } from './lib'
import { CopyButton } from './CopyButton'

export const ConnectionStatus: FC<WithClassName> = ({ className }) => {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()

  const formattedAddress = useMemo(() => address
    ? formatAddress(address)
    : address,
  [address])

  if (isConnected && address && formattedAddress && connector) {
    return (
      <div className={classNames('tw-bg-dim-1 tw-rounded-lg tw-p-3 tw-inline-flex tw-items-center tw-gap-4', className)}>
        <div className="tw-inline-flex tw-items-center tw-gap-2 tw-flex-1">
          <div className="tw-relative tw-circle-10 tw-bg-dim-2 tw-flex-center">
            {ensAvatar
              ? <Image src={ensAvatar} alt="ENS Avatar" fill />
              : <Icon icon={walletIcon} className="tw-text-dim-3 tw-text-lg" />
          }
          </div>
          <div className="tw-font-mono">
            <div>
              <CopyButton value={address}>
                {ensName ?? formattedAddress}
              </CopyButton>
            </div>
            <small className="tw-text-dim-2 tw-text-xs tw-leading-1">Connected to {connector.name}</small>
          </div>
        </div>

        <Button appearance="secondary" onClick={() => disconnect()} className="tw-text-sm">
          Disconnect
        </Button>
      </div>
    )
  }

  return null
}
