import { useMemo } from 'react'
import { useChains } from './useChains'

export const useChain = (chainId?: number) => {
  const chains = useChains()

  const chain = useMemo(() => chainId
    ? chains.find(c => c.id === chainId)
    : undefined,
  [chains, chainId])

  return chain
}
