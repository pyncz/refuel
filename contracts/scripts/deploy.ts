import { ethers } from 'hardhat'
import { config as dotEnvConfig } from 'dotenv'
import { deployContract, setAppEnv } from '../utils'

dotEnvConfig({ debug: true })

const main = async () => {
  const swapRouterAddress = process.env.SWAP_ROUTER_ADDRESS
  if (!swapRouterAddress) {
    throw new Error('"SWAP_ROUTER_ADDRESS" env var is not provided!')
  }

  const refuel = await deployContract(
    'Refuel',
    ethers.getContractFactory('Refuel'),
    swapRouterAddress,
  )
  setAppEnv('AUTOMATED_CONTRACT_ADDRESS', refuel.address)

  const refuelResolver = await deployContract(
    'RefuelResolver',
    ethers.getContractFactory('RefuelResolver'),
  )
  setAppEnv('RESOLVER_CONTRACT_ADDRESS', refuelResolver.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
