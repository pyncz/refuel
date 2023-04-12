import { z } from 'zod'
import { isStringifiedNumber } from '../../utils'

export const stringifiedNumber = z.string().refine(isStringifiedNumber)

export const positiveStringifiedNumber = z
  .union([stringifiedNumber, z.number()])
  .transform(Number)
  .pipe(z.number().positive())
