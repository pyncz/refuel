import type { AppProps, AppType } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { WagmiConfig } from 'wagmi'
import { goerli, hardhat, mainnet } from 'wagmi/chains'
import { setupWeb3Client } from '../utils'
import type { Chain } from '../models'
import { env } from '../env/server.mjs'
import { ChainsProvider } from '../contexts'
import { useAccentColors, useFonts } from '../hooks'

import '../assets/styles/globals.scss'

const App: AppType = ({ Component, pageProps }: AppProps) => {
  useAccentColors()
  useFonts()

  const chains: Chain[] = env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? [mainnet]
    : env.NEXT_PUBLIC_NODE_ENV === 'test'
      ? [goerli]
      : [goerli, hardhat]

  const client = setupWeb3Client(chains)

  return (
    <ChainsProvider chains={chains}>
      <WagmiConfig client={client}>
        <main className="tw-container tw-py-12 tw-min-h-screen tw-flex tw-flex-col tw-gap-4 sm:tw-gap-8">
          <Component {...pageProps} />
        </main>
      </WagmiConfig>
    </ChainsProvider>
  )
}

export default appWithTranslation(App)
