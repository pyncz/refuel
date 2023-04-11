import type { HexAddress } from './evmAddress'

export interface AutomationForm {
  sourceTokenAddress: HexAddress
  watchedTokenAddress?: HexAddress
  threshold: string // untis
  replenishmentAmount: string // untis
}
