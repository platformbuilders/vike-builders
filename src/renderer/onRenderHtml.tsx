import ReactDOMServer from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import type { OnRenderHtmlAsync } from 'vike/types'
import { PageShell } from './getPageElement.js'
import { getTitle } from './getTitle.js'
import { PageContextProvider } from './PageContextProvider.js'
import React from 'react'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { description, favicon } = pageContext.config
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`
  const descriptionTag = !description ? '' : escapeInject`<meta name="description" content="${description}" />`

  const title = getTitle(pageContext)
  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`

  const Head = pageContext.config.Head || (() => <></>)
  const head = (
    <PageContextProvider pageContext={pageContext}>
      <Head />
    </PageContextProvider>
  )

  const headHtml = dangerouslySkipEscape(ReactDOMServer.renderToString(head))

  const sheet = new ServerStyleSheet()
  let pageHtml
  if (!pageContext.Page) {
    // SPA
    pageHtml = ''
  } else {
    // SSR / HTML-only
    const { Page, data } = pageContext
    pageHtml = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <PageShell pageContext={pageContext}>
          <Page {...(data || {})} />
        </PageShell>
      )
    )
  }
  // See https://vike.dev/head
  const desc = String(pageContext.exports.description) || 'App using Vite + Vike'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        ${faviconTag}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${titleTag}
        ${descriptionTag}
        ${headHtml}
        ${dangerouslySkipEscape(sheet.getStyleTags())}
      </head>
      
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    }
  }
}
export { onRenderHtml }
