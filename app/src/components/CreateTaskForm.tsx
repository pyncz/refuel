import type { FC, PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { z } from 'zod'
import { fetchToken } from '@wagmi/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AutomationForm, HexAddress } from '../models'
import { address, intLike } from '../models'
import { Button, ControlledField, ErrorMessage, Input } from './lib'

interface Props {
  chainId?: number
  onSubmit?: (form: AutomationForm) => void
}

export const CreateTaskForm: FC<PropsWithChildren<Props>> = (props) => {
  const {
    chainId,
    onSubmit = () => {},
    children,
  } = props

  const { i18n } = useTranslation()

  const isErc20Address = useCallback(async (address: HexAddress) => {
    try {
      // If no error was thrown, the address is actually erc20
      await fetchToken({ address, chainId })
      return true
    } catch (e) {
      return false
    }
  }, [chainId])

  const automationFormSchema = z.object({
    sourceTokenAddress: address.refine(isErc20Address, i18n.t('errors.notErc20')),
    watchedTokenAddress: address.refine(isErc20Address, i18n.t('errors.notErc20')),
    threshold: intLike.transform(String),
    replenishmentAmount: intLike.transform(String),
  })

  type AutomationFormInput = z.infer<typeof automationFormSchema>

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AutomationFormInput>({
    /**
     * Check how to debug resolver:
     * @see https://react-hook-form.com/api/useform/#resolver
     */
    resolver: zodResolver(automationFormSchema, { async: true }),

    defaultValues: {
      threshold: '0.1',
      replenishmentAmount: '0.1',
    },
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tw-space-y-6">
      <div className="tw-space-y-4">
        <ControlledField<AutomationFormInput, 'sourceTokenAddress'>
          name="sourceTokenAddress"
          control={control}
          label={i18n.t('form.sourceTokenAddress.label')}
          render={({ id, field }) => (
            <Input
              id={id}
              {...field}
              placeholder={i18n.t('form.sourceTokenAddress.placeholder')}
            />
          )}
        />

        <ControlledField<AutomationFormInput, 'watchedTokenAddress'>
          name="watchedTokenAddress"
          control={control}
          label={i18n.t('form.watchedTokenAddress.label')}
          render={({ id, field }) => (
            <Input
              id={id}
              {...field}
              placeholder={i18n.t('form.watchedTokenAddress.placeholder')}
            />
          )}
        />

        <ControlledField<AutomationFormInput, 'threshold'>
          name="threshold"
          control={control}
          label={i18n.t('form.threshold.label')}
          render={({ id, field }) => (
            <Input
              id={id}
              {...field}
              placeholder={i18n.t('form.threshold.placeholder')}
            />
          )}
        />

        <ControlledField<AutomationFormInput, 'replenishmentAmount'>
          name="replenishmentAmount"
          control={control}
          label={i18n.t('form.replenishmentAmount.label')}
          render={({ id, field }) => (
            <Input
              id={id}
              {...field}
              placeholder={i18n.t('form.replenishmentAmount.placeholder')}
            />
          )}
        />
      </div>

      <ErrorMessage error={errors.root} />

      <div>
        {children ?? (
          <Button type="submit">
            {i18n.t('createTask')}
          </Button>
        )}
      </div>
    </form>
  )
}
