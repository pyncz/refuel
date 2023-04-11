import type { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'
import type { Chain } from '../models'

interface ChainsContextType {
  chains: Chain[]
}

export const ChainsContext = createContext<ChainsContextType>({ chains: [] })

export const ChainsProvider: FC<PropsWithChildren<ChainsContextType>> = ({ children, chains }) => {
  return (
    <ChainsContext.Provider value={{ chains }}>
      {children}
    </ChainsContext.Provider>
  )
}
