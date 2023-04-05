import type { Contract, ContractFactory } from 'ethers'

export const deployContract = async <T extends ContractFactory>(
  name: string,
  Factory: Promise<T>,
  ...args: any[]
): Promise<Contract> => {
  const contract = await (await Factory).deploy(...args)

  await contract.deployed()

  // eslint-disable-next-line no-console
  console.log(
    `${name} contract has been deployed to ${contract.address}`,
  )

  return contract
}
