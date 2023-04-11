import type { HexAddress } from './evmAddress'

export interface AutomationForm {
  sourceTokenAddress: HexAddress
  watchedTokenAddress?: HexAddress
  threshold: number
  replenishmentAmount: number
}
