import { AutomateSDK } from '@gelatonetwork/automate-sdk'
import type { Signer } from 'ethers'
import { Contract } from 'ethers'
import type { Nullable, Optional } from '@voire/type-utils'
import type { AutomationForm, HexAddress } from '../models'

export const useGelatoAutomation = (
  chainId: Optional<Nullable<number>>,
  signer: Optional<Nullable<Signer>>,
  automationContractAddress: HexAddress,
  resolverContractAddress: HexAddress,
) => {
  const createTask = async (payload: AutomationForm) => {
    if (signer && chainId) {
      const automate = new AutomateSDK(chainId, signer)

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
        name: `Top up ${payload.watchedTokenAddress} from ${payload.sourceTokenAddress} at ${payload.threshold}`,

        /* Automated contract */
        execAddress: refuelContract.address,
        execSelector: refuelContract.interface.getSighash('execute(address, address, uint256, address, uint256)'),
        execAbi: refuelContract.interface.format('json') as string,
        // execData - populated from the resolver returns

        /* Resolver */
        resolverAddress: refuelResolverContract.address,
        resolverData: refuelContract.interface.encodeFunctionData('checker', [
          await signer.getAddress(), // address _recipient,
          payload.sourceTokenAddress, // address _sourceToken,
          0, // uint256 _sourceMaxAmount,
          payload.watchedTokenAddress, // address _targetToken,
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

      // eslint-disable-next-line no-console
      console.log(`Task with ID ${taskId} has been created!`)

      return { taskId, tx }
    }
  }

  return { createTask }
}