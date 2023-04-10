import { isAddress } from 'ethers/lib/utils'
import type { HexAddress } from '../../models'

/**
 * Checks if the address is a valid address-like hex string
 * @param value Supposed address string
 * @returns Boolean, if the address is a valid hex address
 */
export const isHexAddress = (value: any): value is HexAddress => {
  return typeof value === 'string'
    ? isAddress(value)
    : false
}
