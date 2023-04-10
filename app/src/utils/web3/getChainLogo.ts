export const getChainLogo = (chainId: number) => {
  switch (chainId) {
    case 1:
    case 5:
    case 11155111:
      return '/img/chains/ethereum-eth-logo.svg'
  }
}
