import { ethers } from 'hardhat'
import { config as dotEnvConfig } from 'dotenv'
import { deployContract } from '../utils'

dotEnvConfig({ debug: true })

const main = async () => {
  const swapRouterAddress = process.env.SWAP_ROUTER_ADDRESS
  if (!swapRouterAddress) {
    throw new Error('"SWAP_ROUTER_ADDRESS" env var is not provided!')
  }

  await deployContract(
    'Refuel',
    ethers.getContractFactory('Refuel'),
    swapRouterAddress,
  )
  await deployContract(
    'RefuelResolver',
    ethers.getContractFactory('RefuelResolver'),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
