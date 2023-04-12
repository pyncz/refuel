import { AutomateSDK } from '@gelatonetwork/automate-sdk'
import type { Signer } from 'ethers'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import type { AutomationForm, HexAddress } from '../models'
import { NATIVE_TOKEN_PLACEHOLDER } from '../consts'

export const useGelatoAutomation = (
  chainId: number | undefined,
  signer: Signer | undefined | null,
  automationContractAddress: HexAddress,
  resolverContractAddress: HexAddress,
) => {
  const automate = useMemo(() => chainId && signer
    ? new AutomateSDK(chainId, signer)
    : undefined,
  [chainId, signer])

  const createTask = async (payload: AutomationForm) => {
    if (signer && automate) {
      const sourceToken = new Contract(
        payload.sourceTokenAddress,
        'approve(address spender, uint256 amount)',
        signer,
      )

      // Approve spending of all the tokens in the world to be able to transfer during automation
      // TODO: Add interfaces for user/contract allowances' management
      const approved = await sourceToken.approve(
        automationContractAddress,
        await sourceToken.totalSupply(),
      )

      if (approved) {
        const refuelContract = new Contract(
          automationContractAddress,
          (await import('../../../contracts/artifacts/contracts/Refuel.sol/Refuel.json')).abi,
          signer,
        )

        const refuelResolverContract = new Contract(
          resolverContractAddress,
          (await import('../../../contracts/artifacts/contracts/RefuelResolver.sol/RefuelResolver.json')).abi,
          signer,
        )

        const { taskId, tx } = await automate.createTask({
          name: payload.name,

          /* Automated contract */
          execAddress: refuelContract.address,
          execSelector: refuelContract.interface.getSighash('execute(address, address, uint256, address, uint256)'),
          execAbi: refuelContract.interface.format('json') as string,
          // execData - populated from the resolver returns

          /* Resolver */
          resolverAddress: refuelResolverContract.address,
          resolverData: refuelResolverContract.interface.encodeFunctionData('checker', [
            await signer.getAddress(), // address _recipient,
            payload.sourceTokenAddress, // address _sourceToken,
            0, // uint256 _sourceMaxAmount,
            payload.watchedTokenAddress ?? NATIVE_TOKEN_PLACEHOLDER, // address _targetToken,
            payload.replenishmentAmount, // uint256 _targetAmount,
            payload.threshold, // uint256 _threshold
          ]),
          resolverAbi: refuelResolverContract.interface.format('json') as string,

          startTime: 0, // immediately
          interval: 0, // every block?
          useTreasury: false,
          dedicatedMsgSender: true,
          singleExec: false,
        })

        return { taskId, tx }
      }

      throw new Error('Approval failed!')
    }
  }

  return { automate, createTask }
}
