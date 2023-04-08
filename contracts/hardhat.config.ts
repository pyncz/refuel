import { config as dotEnvConfig } from 'dotenv'
import type { HardhatUserConfig } from 'hardhat/config'
import { requireEnv } from '../utils'

// Plugins
import '@nomicfoundation/hardhat-toolbox'

// Load env
// - load common vars
dotEnvConfig({ debug: true })

const deployer = requireEnv('DEPLOYER_PRIVATE_KEY', process.env.DEPLOYER_PRIVATE_KEY)
const goerliRpcUrl = requireEnv('GOERLI_RPC_URL', process.env.GOERLI_RPC_URL)
const mainnetRpcUrl = requireEnv('MAINNET_RPC_URL', process.env.MAINNET_RPC_URL)

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  defaultNetwork: 'hardhat',

  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        // Fork goerli testnet in order to use WETH
        url: goerliRpcUrl,
      },
    },
    goerli: {
      chainId: 5,
      url: goerliRpcUrl,
      accounts: [deployer],
    },
    mainnet: {
      chainId: 1,
      url: mainnetRpcUrl,
      accounts: [deployer],
    },
  },
}

export default config
