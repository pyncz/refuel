export const allowedMethods = [
  'eth_sendTransaction',
  'eth_signTransaction',
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
]

export enum SessionUpdate {
  CHAIN = 'chainChanged',
  ACCOUNTS = 'accountsChanged',
}
