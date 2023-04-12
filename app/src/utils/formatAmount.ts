import { ethers } from 'ethers'

export const formatAmount = (
  value?: string | number | bigint,
  decimals?: number,
): string | undefined => {
  if (!value) {
    return value?.toString()
  }
  const stringValue = value.toString()
  try {
    return decimals
      ? ethers.utils.parseUnits(stringValue, decimals).toString()
      : stringValue
  } catch (e) {
    return undefined
  }
}
