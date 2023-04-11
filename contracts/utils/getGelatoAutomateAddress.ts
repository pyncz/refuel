/**
 * Get address of Gelato Automate contract for the provided network
 * @see https://docs.gelato.network/developer-services/automate/contract-addresses
 */
export const getGelatoAutomateAddress = (network: string): string => {
  switch (network) {
    case 'hardhat':
    case 'mainnet':
      return '0xB3f5503f93d5Ef84b06993a1975B9D21B962892F'
    case 'localhost':
    case 'goerli':
      return '0xc1C6805B857Bef1f412519C4A842522431aFed39'
  }
  throw new Error('No Gelato Automate address for this network specified!')
}
