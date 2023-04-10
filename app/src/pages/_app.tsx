import type { AppProps, AppType } from 'next/app'
import Link from 'next/link'
import Image from 'next/image'
import { appWithTranslation, useTranslation } from 'next-i18next'
import localFont from '@next/font/local'
import { WagmiConfig, useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { useEffect, useMemo } from 'react'
import { Icon } from '@iconify-icon/react'
import walletIcon from '@iconify/icons-ion/wallet-outline'
import logo from '../assets/img/logo.png'

import { formatAddress, setupWeb3Client } from '../utils'

import '../assets/styles/main.scss'

// Optimize fonts
const Manrope = localFont({
  variable: '--font-manrope',
  style: 'normal',
  src: [
    {
      path: '../assets/fonts/Manrope/Manrope-SemiBold.ttf',
      weight: '600',
    },
    {
      path: '../assets/fonts/Manrope/Manrope-Bold.ttf',
      weight: '700',
    },
    {
      path: '../assets/fonts/Manrope/Manrope-ExtraBold.ttf',
      weight: '800',
    },
  ],
})
const OpenSans = localFont({
  variable: '--font-opensans',
  style: 'normal',
  src: [
    {
      path: '../assets/fonts/OpenSans/OpenSans-Light.ttf',
      weight: '300',
    },
    {
      path: '../assets/fonts/OpenSans/OpenSans-Regular.ttf',
      weight: '400',
    },
  ],
})
const DMMono = localFont({
  variable: '--font-dm-mono',
  src: '../assets/fonts/DM_Mono/DMMono-Regular.ttf',
  weight: '400',
})

const fonts = [Manrope, OpenSans, DMMono]

const App: AppType = ({ Component, pageProps }: AppProps) => {
  const { i18n } = useTranslation()

  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()

  const formattedAddress = useMemo(() => address
    ? formatAddress(address)
    : address,
  [address])

  useEffect(() => {
    const root = document.getElementsByTagName('html')[0]!
    root.classList.add(...fonts.map(font => font.variable))
  }, [])

  return (
    <WagmiConfig client={setupWeb3Client()}>
      <main className="tw-container tw-py-12 tw-min-h-screen tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex-center-y tw-flex-col tw-justify-between sm:tw-flex-row">
          <Link href="/">
            <Image
              src={logo}
              alt={i18n.t('logo', { name: 'refuel' })}
              className="tw--ml-1.5 tw-h-8 tw-w-auto"
            />
          </Link>

          {isConnected && formattedAddress && connector
            ? (
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
            : null
          }
        </div>

        <div className="tw-flex-1 tw-flex-center tw-flex-col tw-gap-4">
          <Component {...pageProps} />
        </div>
      </main>
    </WagmiConfig>
  )
}

export default appWithTranslation(App)
