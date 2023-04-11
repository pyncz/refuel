import type { AppProps, AppType } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import localFont from 'next/font/local'
import { WagmiConfig } from 'wagmi'
import { goerli, hardhat, mainnet } from 'wagmi/chains'
import { useEffect } from 'react'
import { setupWeb3Client } from '../utils'
import type { Chain } from '../models'
import { ConnectionStatus, LogoLink } from '../components'

import '../assets/styles/globals.scss'
import { env } from '../env/server.mjs'
import { ChainsProvider } from '../contexts'

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
  useEffect(() => {
    const root = document.getElementsByTagName('html')[0]!
    root.classList.add(...fonts.map(font => font.variable))
  }, [])

  const chains: Chain[] = env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? [mainnet]
    : env.NEXT_PUBLIC_NODE_ENV === 'test'
      ? [goerli]
      : [goerli, hardhat]

  const client = setupWeb3Client(chains)

  return (
    <ChainsProvider chains={chains}>
      <WagmiConfig client={client}>
        <main className="tw-container tw-py-12 tw-min-h-screen tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex-center-y tw-flex-col tw-gap-4 tw-justify-between sm:tw-flex-row">
            <LogoLink />
            <div className="sm:tw-h-0 tw-inline-flex tw-w-full sm:tw-w-auto tw-items-center">
              <ConnectionStatus className="tw-w-full" />
            </div>
          </div>

          <div className="tw-flex-1 tw-flex-center tw-flex-col tw-gap-4">
            <Component {...pageProps} />
          </div>
        </main>
      </WagmiConfig>
    </ChainsProvider>
  )
}

export default appWithTranslation(App)
