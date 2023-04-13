import type { FC, PropsWithChildren } from 'react'
import classNames from 'classnames'
import type { WithClassName } from '../models'

export const Card: FC<PropsWithChildren<WithClassName>> = (props) => {
  const { children, className } = props

  return (
    <div
      className={classNames(
        'tw-rounded-lg sm:tw-rounded-xl tw-bg-dim-1 tw-w-full tw-p-6 sm:tw-p-8 tw-relative tw-bg-opacity-soft',
        'after:tw-pointer-events-none after:tw-absolute after:tw-inset-0 after:tw-rounded-lg sm:after:tw-rounded-xl after:tw-border after:tw-border-dim-2',
        className,
      )}
    >
      {children}
    </div>
  )
}
