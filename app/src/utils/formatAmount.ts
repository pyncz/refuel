import { ethers } from 'ethers'
import { formatThousands } from './formatThousands'

export const formatAmount = (
  value?: string | number | bigint,
  decimals?: number,
): string | undefined => {
  if (!value) {
    return value?.toString()
  }

  const stringValue = value.toString()

  try {
    const parsed = decimals
      ? ethers.utils.parseUnits(stringValue, decimals).toString()
      : stringValue

    return parsed
      ? formatThousands(parsed)
      : undefined
  } catch (e) {
    return undefined
  }
}
