import { Html, Head, Main, NextScript } from 'next/document'
import { useState } from 'react'
import { useEffect } from 'react'

export default function Document() {
  const [isLoginPage, setIsLoginPage] = useState(false)

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setIsLoginPage(true)
    }
  }, [setIsLoginPage])

  return (
    <Html lang="en">
      <Head>
        <base href="/" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="assets/favicon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="assets/favicon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="assets/favicon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
