import type { ZodType, ZodTypeDef } from 'zod'
import { z } from 'zod'
import type { StringifiedNumber } from '@voire/type-utils'
import { isStringifiedNumber } from '../../utils'

export const stringifiedNumber: ZodType<StringifiedNumber, ZodTypeDef, string> = z.custom<StringifiedNumber>(isStringifiedNumber)

export const positiveStringifiedNumber = stringifiedNumber.transform(Number).pipe(z.number().positive())
