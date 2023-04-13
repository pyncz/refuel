import { config as dotEnvConfig } from 'dotenv'
import type { HardhatUserConfig } from 'hardhat/config'
import { requireEnv } from '../utils'

// Plugins
import '@nomicfoundation/hardhat-toolbox'

// Load env
// - load common vars
dotEnvConfig({ debug: true })

const deployer = requireEnv('DEPLOYER_PRIVATE_KEY', process.env.DEPLOYER_PRIVATE_KEY)
const testAccount = process.env.TEST_ACCOUNT_PRIVATE_KEY
const goerliRpcUrl = requireEnv('GOERLI_RPC_URL', process.env.GOERLI_RPC_URL)
const mainnetRpcUrl = requireEnv('MAINNET_RPC_URL', process.env.MAINNET_RPC_URL)

const devDeployerAccountConfig = {
  privateKey: deployer,
  balance: '1000000000000000000', // 1 eth
}

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  defaultNetwork: 'hardhat',

  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        // Fork mainnet
        url: mainnetRpcUrl,
        blockNumber: 17040137,
      },
      accounts: testAccount
        ? [
            devDeployerAccountConfig,
            {
              privateKey: testAccount,
              balance: '1000000000000000000', // 1 eth
            },
          ]
        : [devDeployerAccountConfig],
    },
    goerli: {
      chainId: 5,
      url: goerliRpcUrl,
      accounts: testAccount ? [deployer, testAccount] : [deployer],
    },
    mainnet: {
      chainId: 1,
      url: mainnetRpcUrl,
      accounts: testAccount ? [deployer, testAccount] : [deployer],
    },
  },
}

export default config
