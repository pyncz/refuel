/* eslint-disable no-console */
import hre, { ethers } from 'hardhat'
import { deployContract, getGelatoAutomateAddress, getWethAddress, setAppEnv, validateEnv } from '../utils'

const main = async () => {
  const networkName = hre.network.name

  // Log current network
  console.log(`Deploying on ${networkName}...`)

  const swapRouterAddress = validateEnv('SWAP_ROUTER_ADDRESS', process.env.SWAP_ROUTER_ADDRESS)
  console.log(`SwapRouter address is ${swapRouterAddress}`)

  const wethAddress = getWethAddress(networkName)
  console.log(`WETH address is ${wethAddress}`)

  const automateAddress = getGelatoAutomateAddress(networkName)
  console.log(`Gelato Automate address is ${automateAddress}`)

  /**
   * Actually, deploy
   */
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  // Log the balance before deploying
  console.log('Deployer account balance:', (await deployer.getBalance()).toString())

  const refuel = await deployContract(
    'Refuel',
    ethers.getContractFactory('Refuel'),
    swapRouterAddress,
    automateAddress,
    wethAddress,
  )
  setAppEnv('NUXT_AUTOMATED_CONTRACT_ADDRESS', refuel.address)

  const refuelResolver = await deployContract(
    'RefuelResolver',
    ethers.getContractFactory('RefuelResolver'),
  )
  setAppEnv('NUXT_RESOLVER_CONTRACT_ADDRESS', refuelResolver.address)

  // Log the balance after deploying
  console.log('Deployer account balance:', (await deployer.getBalance()).toString())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
