import { requireEnv } from '../utils'
import { Chain } from './models'

const isDev = !!process.env.IS_DEV
const chainsEnv = process.env.CHAINS_ENV === 'main' ? 'main' : 'test'

export const chains = isDev
  ? [Chain.hardhat] // hardhat dev chain
  : []
if (chainsEnv === 'main') {
  chains.push(
    Chain.mainnet,
  )
} else {
  chains.push(
    Chain.goerli,
  )
}

export default defineNuxtConfig({
  /*
  * Build config
  */
  typescript: {
    strict: true,
  },

  css: ['~/assets/styles/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n-edge',
    '@vue-macros/nuxt',
    'nuxt-icon',
  ],

  runtimeConfig: {
    public: {
      WALLETCONNECT_PROJECT_ID: requireEnv('WALLETCONNECT_PROJECT_ID', process.env.WALLETCONNECT_PROJECT_ID),
      WALLETCONNECT_RELAY_URL: process.env.WALLETCONNECT_RELAY_URL ?? 'wss://relay.walletconnect.com',
      RESOLVER_CONTRACT_ADDRESS: requireEnv('RESOLVER_CONTRACT_ADDRESS', process.env.RESOLVER_CONTRACT_ADDRESS),
      AUTOMATED_CONTRACT_ADDRESS: requireEnv('AUTOMATED_CONTRACT_ADDRESS', process.env.AUTOMATED_CONTRACT_ADDRESS),
      MAINNET_RPC_URL: requireEnv('MAINNET_RPC_URL', process.env.MAINNET_RPC_URL),
      GOERLI_RPC_URL: requireEnv('GOERLI_RPC_URL', process.env.GOERLI_RPC_URL),
      chains,
    },
  },

  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        name: 'en',
        file: 'en-US.yml',
        iso: 'en-US',
      },
    ],
    vueI18n: {
      fallbackLocale: 'en',
    },
    strategy: 'prefix_and_default',
    lazy: true,
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n',
    },
  },
})
