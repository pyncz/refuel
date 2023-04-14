/**
 * Get address of the UNI ERC20 token contract for the provided network
 */
export const getUniAddress = (network: string): string => {
  switch (network) {
    case 'hardhat':
    case 'localhost':
    case 'mainnet':
    case 'goerli':
      return '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
  }
  throw new Error('No UNI address for this network specified!')
}
