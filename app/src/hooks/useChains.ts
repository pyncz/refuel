import { useContext } from 'react'
import { ChainsContext } from '../contexts'

export const useChains = () => {
  const { chains } = useContext(ChainsContext)
  return chains
}
