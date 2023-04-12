import { Contract } from 'ethers'
import { ethers } from 'hardhat'

// Address of the Tether ERC20 token on the mainnet (and on the dev hardhat form, apparently)
const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7'
const erc20Abi = [
  'function transfer(address to, uint amount)',
  'function issue(uint amount)',
]
const OWNER_SLOT = '0x0'

const main = async () => {
  const devAccounts = await ethers.getSigners()
  const newOwner = devAccounts[0]
  const newOwnerAddress = await newOwner.getAddress()
  const amountPerAccount = 1000
  const usdt = new Contract(USDT_ADDRESS, erc20Abi, newOwner)

  // update owner
  const value = ethers.utils.hexZeroPad(newOwnerAddress, 32)
  await ethers.provider.send('hardhat_setStorageAt', [USDT_ADDRESS, OWNER_SLOT, value])

  // mint tokens
  const amountInUnits = ethers.utils.parseEther(amountPerAccount.toString())
  await usdt.issue(
    amountInUnits.mul(devAccounts.length),
  )

  for (const devAccount of devAccounts) {
    // transfer some to each of dev accounts
    await usdt.transfer(
      await devAccount.getAddress(),
      amountInUnits,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
