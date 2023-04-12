import type { FC, PropsWithChildren } from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { z } from 'zod'
import { fetchToken } from '@wagmi/core'
import { useAccount, useToken } from 'wagmi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AutomationForm, HexAddress } from '../models'
import { address, positiveStringifiedNumber } from '../models'
import { useChain, useIsMounted, useValidValue } from '../hooks'
import { formatAmount } from '../utils'
import { Button, ControlledField, ErrorMessage } from './lib'
import { TokenInput } from './TokenInput'
import { AmountInput } from './AmountInput'

interface Props {
  chainId?: number
  onSubmit?: (form: AutomationForm) => void
}

export const CreateTaskForm: FC<PropsWithChildren<Props>> = (props) => {
  const {
    chainId,
    onSubmit: onFormattedSubmit,
    children,
  } = props

  const { i18n } = useTranslation()
  const { isConnected } = useAccount()
  const isMounted = useIsMounted()

  const chain = useChain(chainId)

  /**
   * Validator for token addresses
   */
  const isErc20Address = useCallback(async (address: HexAddress) => {
    try {
      // If no error was thrown, the address is actually erc20
      await fetchToken({ address, chainId })
      return true
    } catch (e) {
      return false
    }
  }, [chainId])

  /**
   * Automation Form
   */
  const automationFormSchema = z.object({
    sourceTokenAddress: address.refine(isErc20Address, i18n.t('errors.notErc20')),
    watchedTokenAddress: address.refine(
      a => !a || isErc20Address(a),
      i18n.t('errors.notErc20'),
    ),
    threshold: positiveStringifiedNumber,
    replenishmentAmount: positiveStringifiedNumber,
  })

  type AutomationFormParsed = z.infer<typeof automationFormSchema>

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AutomationFormParsed>({
    /**
     * Check how to debug resolver:
     * @see https://react-hook-form.com/api/useform/#resolver
     */
    resolver: zodResolver(automationFormSchema, { async: true }),

    defaultValues: {
      threshold: 0.1,
      replenishmentAmount: 0.1,
    },
    mode: 'onChange',
  })

  /**
   * Source token data
   */
  // Valid source token address
  const validSourceTokenAddress = useValidValue(control, watch, 'sourceTokenAddress')

  const { data: sourceTokenData } = useToken({
    address: validSourceTokenAddress,
    cacheTime: 5_000,
    chainId,
  })

  /**
   * Target token data
   */
  // Valid target token address
  const validWatchedTokenAddress = useValidValue(control, watch, 'watchedTokenAddress')

  const { data: targetErc20TokenData } = useToken({
    address: validWatchedTokenAddress,
    cacheTime: 5_000,
    chainId,
  })

  const targetTokenData = useMemo(() => {
    return validWatchedTokenAddress
      ? targetErc20TokenData // use specified erc20 token
      : chain?.nativeCurrency // use native token
  }, [validWatchedTokenAddress, chain, targetErc20TokenData])
  const targetTokenDecimals = useMemo(() => targetTokenData?.decimals, [targetTokenData])

  const validThreshold = useValidValue(control, watch, 'threshold')
  const thresholdInUnits = useMemo(
    () => formatAmount(validThreshold, targetTokenDecimals),
    [validThreshold, targetTokenDecimals],
  )

  const validReplenishmentAmount = useValidValue(control, watch, 'replenishmentAmount')
  const replenishmentAmountInUnits = useMemo(
    () => formatAmount(validReplenishmentAmount, targetTokenDecimals),
    [validReplenishmentAmount, targetTokenDecimals],
  )

  /**
   * On form submitted and the payload is successfully parsed
   */
  const onSubmit = useCallback((payload: AutomationFormParsed) => {
    if (onFormattedSubmit && thresholdInUnits && replenishmentAmountInUnits) {
      onFormattedSubmit({
        ...payload,
        threshold: thresholdInUnits,
        replenishmentAmount: replenishmentAmountInUnits,
      })
    }
  }, [onFormattedSubmit, thresholdInUnits, replenishmentAmountInUnits])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tw-space-y-6">
      <div className="tw-space-y-4">
        <ControlledField<AutomationFormParsed, 'watchedTokenAddress'>
          name="watchedTokenAddress"
          control={control}
          label={i18n.t('form.watchedTokenAddress.label')}
          render={({ id, field }) => (
            <TokenInput
              id={id}
              asset={targetTokenData}
              {...field}
              className="tw-w-full"
              placeholder={i18n.t('form.watchedTokenAddress.placeholder')}
            />
          )}
        />

        <ControlledField<AutomationFormParsed, 'threshold'>
          name="threshold"
          control={control}
          secondary
          label={i18n.t('form.threshold.label')}
          render={({ id, field }) => (
            <AmountInput
              id={id}
              asset={targetTokenData}
              {...field}
              className="tw-w-full"
              placeholder={i18n.t('form.threshold.placeholder')}
              subtitle={thresholdInUnits}
            />
          )}
        />

        <ControlledField<AutomationFormParsed, 'replenishmentAmount'>
          name="replenishmentAmount"
          control={control}
          secondary
          label={i18n.t('form.replenishmentAmount.label')}
          render={({ id, field }) => (
            <AmountInput
              id={id}
              asset={targetTokenData}
              {...field}
              className="tw-w-full"
              placeholder={i18n.t('form.replenishmentAmount.placeholder')}
              subtitle={replenishmentAmountInUnits}
            />
          )}
        />

        <ControlledField<AutomationFormParsed, 'sourceTokenAddress'>
          name="sourceTokenAddress"
          control={control}
          label={i18n.t('form.sourceTokenAddress.label')}
          render={({ id, field }) => (
            <TokenInput
              id={id}
              {...field}
              asset={sourceTokenData}
              className="tw-w-full"
              placeholder={i18n.t('form.sourceTokenAddress.placeholder')}
            />
          )}
        />
      </div>

      <ErrorMessage error={errors.root} />

      {isMounted && (isConnected || !children)
        ? (
          <Button type="submit" className="tw-w-full">
            {i18n.t('createTask')}
          </Button>
          )
        : children
      }
    </form>
  )
}
