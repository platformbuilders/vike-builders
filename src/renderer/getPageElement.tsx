import React from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from './PageContextProvider.js'

function PassThrough({ children }: any) {
  return <>{children}</>
}
export function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  const Layout = pageContext.config.Layout || PassThrough
  return (
    <PageContextProvider pageContext={pageContext}>
      <Layout>{children}</Layout>
    </PageContextProvider>
  )
}
