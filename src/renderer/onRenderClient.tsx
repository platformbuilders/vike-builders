// https://vike.dev/onRenderClient
export { onRenderClient }
import React from 'react'
import ReactDOM from 'react-dom/client'
import { getTitle } from './getTitle.js'
import type { OnRenderClientAsync } from 'vike/types'
import { PageShell } from './getPageElement.js'

let root: ReactDOM.Root
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page, data } = pageContext

  const page = <PageShell pageContext={pageContext}>{!!Page ? <Page {...(data || {})} /> : null}</PageShell>

  const container = document.getElementById('page-view')!
  if (container.innerHTML !== '' && pageContext.isHydration) {
    // Hydration
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) {
      // First rendering
      root = ReactDOM.createRoot(container)
    } else {
      const title = getTitle(pageContext)
      document.title = title || ''
    }

    root.render(page)
  }
}
