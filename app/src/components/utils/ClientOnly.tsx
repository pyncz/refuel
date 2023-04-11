import type { FC, PropsWithChildren } from 'react'
import { useIsMounted } from '../../hooks'

export const ClientOnly: FC<PropsWithChildren> = ({ children }) => {
  const isMounted = useIsMounted()

  if (isMounted) {
    return <>{children}</>
  }

  return null
}
