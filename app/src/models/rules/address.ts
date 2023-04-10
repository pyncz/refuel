import type { ZodType, ZodTypeDef } from 'zod'
import { z } from 'zod'
import { isEvmAddress, isHexAddress } from '../../utils'
import type { EvmAddress, HexAddress } from '../evmAddress'

export const address: ZodType<HexAddress, ZodTypeDef, string> = z.custom<HexAddress>(isHexAddress)

export const addressOrEnsName: ZodType<EvmAddress, ZodTypeDef, string> = z.custom<EvmAddress>(isEvmAddress)
