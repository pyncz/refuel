import type { FC } from 'react'
import classNames from 'classnames'
import { Icon } from '@iconify-icon/react'
import openIcon from '@iconify/icons-ion/open-outline'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import type { Task, WithClassName } from '../models'
import { getTaskUrl } from '../utils'
import { Card } from './Card'

interface Props extends Task {
  chainId?: number
}

export const GelatoTask: FC<WithClassName<Props>> = (props) => {
  const { chainId, taskId, name, className } = props
  const { i18n } = useTranslation()

  return (
    <a
      href={getTaskUrl(taskId, chainId)}
      target="_blank"
      rel="noreferrer"
      className="tw-border-none tw-flex"
    >
      <Card
        className={classNames(
          'tw-flex tw-items-start tw-gap-2 !tw-py-6',
          'after:tw-opacity-20 tw-group/card after:tw-duration-normal hover:after:tw-opacity-soft',
          className,
        )}
      >
        <Image
          src="/img/gelato.svg"
          alt={i18n.t('logo', { name: 'Gelato' })}
          className="tw--ml-1"
          width={32}
          height={32}
        />
        <div className="tw-flex-1 tw-py-1">
          <span className="tw-text-dim-1">{name}</span>{' '}
          <Icon
            icon={openIcon}
            className="tw-duration-normal tw-relative tw-top-px hover:tw-scale-[1.1] tw-text-dim-3 group-hover/card:tw-text-dim-2"
          />
        </div>
      </Card>
    </a>
  )
}
