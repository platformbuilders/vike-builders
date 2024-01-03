import ReactDOMServer from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import type { OnRenderHtmlAsync } from 'vike/types'
import { PageShell } from './getPageElement.js'
import React from 'react'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const sheet = new ServerStyleSheet()
  let pageHtml
  let test = 't'
  if (!pageContext.Page) {
    // SPA
    pageHtml = ''
  } else {
    // SSR / HTML-only
    const { Page, data } = pageContext
    test = 'passou aqui'
    pageHtml = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <PageShell pageContext={pageContext}>
          <Page {...(data || {})} />
        </PageShell>
      )
    )
  }
  // See https://vike.dev/head
  const title = String(pageContext.exports.title) || 'Vite SSR app'
  const desc = String(pageContext.exports.description) || 'App using Vite + Vike'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(sheet.getStyleTags())}
      </head>
      
      <body>
      <div>${test}</div>

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
