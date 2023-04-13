import type { HexAddress } from './evmAddress'

export interface AutomationForm {
  /** Task name */
  name: string

  sourceTokenAddress: HexAddress

  /** `undefined` for a native token */
  watchedTokenAddress?: HexAddress

  /** Untis */
  threshold: string

  /** Untis */
  replenishmentAmount: string
}

export type { Task } from '@gelatonetwork/automate-sdk'
