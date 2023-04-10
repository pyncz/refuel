import classNames from 'classnames'
import type { FC } from 'react'
import type { WithClassName } from '../../../models'

interface Props {
  error?: { message?: string }
}

export const ErrorMessage: FC<WithClassName<Props>> = ({ error, className }) => {
  if (error) {
    return (
      <p role="alert" className={classNames('tw-text-state-error tw-text-3/4', className)}>
        {error.message ?? error.toString()}
      </p>
    )
  }

  return null
}
