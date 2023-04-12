import type { PropsWithChildren } from 'react'
import { forwardRef } from 'react'
import classNames from 'classnames'
import type { InputProps, WithClassName } from '../models'
import { Input } from './lib'

interface Props extends InputProps {
  subtitle?: string | ((value?: string | number | bigint) => string)
}

export const SubtitledInput = forwardRef<HTMLInputElement, PropsWithChildren<WithClassName<Props>>>((props, ref) => {
  const { subtitle, value, className, children, ...attributes } = props

  const stringSubtitle = typeof subtitle === 'string'
    ? subtitle
    : subtitle?.(value)

  return (
    <div className="tw-relative tw-h-ui xs:tw-h-14">
      <Input
        {...attributes}
        value={value}
        ref={ref}
        className={classNames(
          className,
          'tw-absolute tw-h-auto tw-inset-0',
          { 'xs:tw-pb-5': !!stringSubtitle },
        )}
      />

      {children}

      {stringSubtitle
        ? <small className="tw-hidden xs:tw-block tw-text-dim-3 tw-truncate tw-text-xs tw-absolute tw-inset-x-0 tw-px-ui tw-top-8 tw-pointer-events-none">{stringSubtitle}</small>
        : null
      }
    </div>
  )
})

SubtitledInput.displayName = 'SubtitledInput'
