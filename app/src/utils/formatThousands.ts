import type { BigNumberish } from 'ethers'

export const formatThousands = (value: BigNumberish): string => {
  return String(value).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
}
