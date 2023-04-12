import type { FC, ReactNode } from 'react'
import { useId } from 'react'
import * as Label from '@radix-ui/react-label'
import type { FieldError } from 'react-hook-form'
import classNames from 'classnames'
import type { WithClassName } from '../../../models'
import { ErrorMessage } from './ErrorMessage'

interface Props {
  render: (id: string) => ReactNode
  label?: string
  error?: FieldError
  secondary?: boolean
}

export const Field: FC<WithClassName<Props>> = (props) => {
  const { render, label, error, secondary, className } = props

  const id = useId()
  const contextClassNames = 'tw-duration-normal tw-opacity-muted group-hover/field:tw-opacity-soft group-focus-within/field:!tw-opacity-full'

  return (
    <div className={classNames('tw-space-y-1 tw-group/field', className)}>
      {label
        ? (
          <div className="tw-flex">
            <Label.Root
              htmlFor={id}
              className={classNames({ 'tw-text-3/4': secondary }, contextClassNames)}
            >{label}</Label.Root>
          </div>
          )
        : null
      }

      {render(id)}

      <ErrorMessage
        className={contextClassNames}
        error={error}
      />
    </div>
  )
}
