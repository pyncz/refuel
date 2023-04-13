export const getTaskUrl = (taskId: string, chainId?: number): string => {
  return `https://app.gelato.network/task/${taskId}${chainId ? `?chainId=${chainId}` : ''}`
}
