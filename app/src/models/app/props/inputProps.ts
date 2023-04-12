import type { MaybePromise, OmitListeners } from '@voire/type-utils'
import type { InputHTMLAttributes } from 'react'

export interface InputProps extends OmitListeners<Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>> {
  value?: string | number | undefined
  label?: string
  onChange?: (value: string) => MaybePromise<void>
  onBlur?: () => MaybePromise<void>
}
