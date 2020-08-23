/* eslint-disable react/no-danger, import/no-unresolved */
import React from 'react'
import Document, { Head, Main, NextScript, NextDocumentContext } from 'next/document'
import { extractStyles } from 'evergreen-ui'

interface SSRDocProps {
  css: string
  hydrationScript: string
}

export default class SSRDoc extends Document<SSRDocProps> {
  public static getInitialProps({ renderPage }: NextDocumentContext) {
    const page = renderPage()
    // `css` is a string with css from both glamor and ui-box.
    // No need to get the glamor css manually if you are using it elsewhere in your app.
    //
    // `hydrationScript` is a script you should render on the server.
    // It contains a stringified version of the glamor and ui-box caches.
    // Evergreen will look for that script on the client and automatically hydrate
    // both glamor and ui-box.
    const { css, hydrationScript } = extractStyles()

    return {
      ...page,
      css,
      hydrationScript
    }
  }

  public render() {
    const { css, hydrationScript } = this.props

    const globalStyles = `
      body {
        background: #F5F6F7;
        margin: 0;
      }
    `

    return (
      <html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <style>{globalStyles}</style>
        </Head>

        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </html>
    )
  }
}
