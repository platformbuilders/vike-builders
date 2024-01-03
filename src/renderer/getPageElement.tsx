import React from 'react'
import { ThemeProvider } from 'styled-components'
import type { PageContext } from 'vike/types'
import { themeFormatter } from '@platformbuilders/theme-toolkit'
import { PageContextProvider } from './PageContextProvider.js'

function PassThrough({ children }: any) {
  return <>{children}</>
}
export function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  const Layout = pageContext.config.Layout || PassThrough
  const themeJson = themeFormatter(pageContext.config.theme) ?? {}
  return (
    <PageContextProvider pageContext={pageContext}>
      <Layout theme={themeJson}>{children}</Layout>
    </PageContextProvider>
  )
}
