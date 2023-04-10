import type { FC } from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

export const LogoLink: FC = () => {
  const { i18n } = useTranslation()

  return (
    <Link href="/" className="!tw-border-none tw-duration-normal tw-opacity-soft hover:tw-opacity-full">
      {
      // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/img/logo.png"
          alt={i18n.t('logo', { name: 'refuel' })}
          height={32}
          className="tw--ml-1.5 tw-h-8 tw-w-auto"
        />
      }
    </Link>
  )
}
