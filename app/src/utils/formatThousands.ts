export const formatThousands = (value: string): string => {
  return value.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
}
