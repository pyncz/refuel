const isDev = !!process.env.IS_DEV
const chainsEnv = process.env.CHAINS_ENV === 'main' ? 'main' : 'test'

const chains: string[] = isDev
  ? ['eip155:31337'] // hardhat dev chain
  : []
if (chainsEnv === 'main') {
  chains.push(
    'eip155:1',
  )
} else {
  chains.push(
    'eip155:5',
  )
}

export default defineNuxtConfig({
  /*
  * Build config
  */
  typescript: {
    strict: true,
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  runtimeConfig: {
    public: {
      WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID ?? '',
      WALLETCONNECT_RELAY_URL: process.env.WALLETCONNECT_RELAY_URL ?? 'wss://relay.walletconnect.com',
      RESOLVER_CONTRACT_ADDRESS: process.env.RESOLVER_CONTRACT_ADDRESS,
      AUTOMATED_CONTRACT_ADDRESS: process.env.AUTOMATED_CONTRACT_ADDRESS,
      chains,
    },
  },
})
