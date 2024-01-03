import React from 'react'
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

type Props = {
  children: ReactNode
}
export const ClientOnly: FC<Props> = ({ children }): ReactElement<any, any> | null => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return <>{children}</>
}
