import type { FC } from 'react'

export const Spinner: FC = () => {
  return (
    <div className="tw-circle-em tw-border-2 tw-border-l-transparent tw-border-current tw-animate-spin before:tw-absolute before:tw--inset-[2px] before:tw-rounded-full before:tw-opacity-20 before:tw-border-2 before:tw-border-current" />
  )
}
