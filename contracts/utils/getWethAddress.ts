/**
 * Get address of the ERC20 wrapped native token contract for the provided network
 * @see https://docs.uniswap.org/contracts/v3/reference/deployments
 */
export const getWethAddress = (network: string): string => {
  switch (network) {
    case 'hardhat':
    case 'localhost':
    case 'mainnet':
      return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    case 'goerli':
      return '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
  }
  throw new Error('No WETH address for this network specified!')
}
