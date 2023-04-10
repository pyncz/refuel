import type { FC } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useMemo } from 'react'
import { Icon } from '@iconify-icon/react'
import walletIcon from '@iconify/icons-ion/wallet-outline'
import Image from 'next/image'
import { formatAddress } from '../utils'

export const ConnectionStatus: FC = () => {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()

  const formattedAddress = useMemo(() => address
    ? formatAddress(address)
    : address,
  [address])

  if (isConnected && formattedAddress && connector) {
    return (
      <div className="tw-bg-dim-1 tw-rounded-sm tw-px-2 tw-py-1 tw-inline-flex tw-items-center tw-gap-2">
        <div className="tw-relative tw-circle-12 tw-bg-dim-2">
          {ensAvatar
            ? <Image src={ensAvatar} alt="ENS Avatar" fill />
            : <Icon icon={walletIcon} className="tw-size-8 tw-text-dim-2" />
          }
        </div>
        <div>

        </div>
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector.name}</div>
        <div className="tw-font-mono">
          <div>{formattedAddress}</div>
          <div>Connected to {connector.name}</div>
        </div>

        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  return null
}
