import type { Chain } from 'wagmi'
import { configureChains, createClient } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { env } from '../env/client.mjs'
import { getAbsoluteBaseUrl } from './app/getBaseUrl'

export const setupWeb3Client = (chains: Chain[]) => {
  const baseUrl = getAbsoluteBaseUrl()

  const { provider, webSocketProvider } = configureChains(
    chains,
    [
      alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_ID }),
      publicProvider(),
    ],
  )

  return createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'refuel',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          metadata: {
            name: 'refuel',
            description: '⛽ Don\'t let your account run out of fuel',
            url: baseUrl,
            icons: [`${baseUrl}/img/logo-icon.png`],
          },
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })
}
