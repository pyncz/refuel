import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import hre, { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { deployContract, getGelatoAutomateAddress, getWeth9Address } from '../utils'
import { requireEnv } from '../../utils'
import { NATIVE_TOKEN_PLACEHOLDER, erc20Abi, swapRouterAbi } from '../../consts'
import { getUniAddress } from '../utils/test'

describe('Refuel', () => {
  const networkName = hre.network.name

  // Deploying argument
  const swapRouterAddress = requireEnv('SWAP_ROUTER_ADDRESS', process.env.SWAP_ROUTER_ADDRESS)
  const weth9Address = getWeth9Address(networkName)
  const automateAddress = getGelatoAutomateAddress(networkName)

  // Test tokens
  const erc20Address = getUniAddress(networkName)
  // instance without a provider to connect to
  const _erc20 = new Contract(erc20Address, erc20Abi)

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [owner, testAccount] = await ethers.getSigners()

    const refuel = await deployContract(
      'Refuel',
      ethers.getContractFactory('Refuel'),
      swapRouterAddress,
      automateAddress,
      weth9Address,
    )

    // swap for some erc20 tokens
    const _swapRouter = new Contract(swapRouterAddress, swapRouterAbi)
    const ethersToSpend = ethers.utils.parseEther('0.2')

    for (const account of [owner, testAccount]) {
      // swap for erc20
      await _swapRouter
        .connect(account)
        .exactInputSingle(
          {
            tokenIn: weth9Address,
            tokenOut: erc20Address,
            fee: 3000, // 0.3%
            recipient: account.address,
            amountIn: ethersToSpend,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0,
            deadline: 2000000000, // far distant future
          },
          { value: ethersToSpend },
        )
    }

    return { refuel, owner, testAccount }
  }

  describe('Deployment', () => {
    it('Should set the right owner', async () => {
      const { refuel, owner } = await loadFixture(deployFixture)
      expect(await refuel.owner()).to.equal(owner.address)
    })
  })

  describe('execute', () => {
    it('Should replenish native token balance', async () => {
      const { refuel, testAccount } = await loadFixture(deployFixture)
      const amountToReplenish = ethers.utils.parseEther('0.1')
      const erc20 = _erc20.connect(testAccount)

      await erc20.approve(
        refuel.address,
        await erc20.totalSupply(),
      )

      await expect(refuel.connect(testAccount).execute(
        testAccount.address,
        erc20.address,
        0,
        NATIVE_TOKEN_PLACEHOLDER,
        amountToReplenish,
      )).to.changeEtherBalance(testAccount, amountToReplenish)
    })
  })
})
