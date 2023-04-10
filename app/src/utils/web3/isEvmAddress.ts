import type { EvmAddress } from '../../models'
import { isHexAddress } from './isHexAddress'

/**
 * Checks if the address is a valid EVM address-like string
 * @param value Supposed address string
 * @returns Boolean, if the address is a valid hex address or ENS-resolvable string
 */
export const isEvmAddress = (value: any): value is EvmAddress => {
  return typeof value === 'string'
    ? isHexAddress(value) || /^[^\s]+\.[^\s]+$/i.test(value)
    : false
}
