import { useMemo } from 'react'
import { formatAmount, formatThousands } from '../utils'

export const useAmount = (value?: number, decimals?: number) => {
  const units = useMemo(
    () => formatAmount(value, decimals),
    [value, decimals],
  )

  const formatted = useMemo(
    () => units ? formatThousands(units) : undefined,
    [units],
  )

  return { units, formatted }
}
