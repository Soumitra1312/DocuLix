// ...existing code...
import "./styles.css"
import "../styles/demo.css"
import "./dashboard.css"
import "./signout.css"
import type { AppProps } from "next/app"
// ...existing code...
import Head from "next/head"

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return (
    <>
      <Head>
        <title>DocuLix - Turning legal jargon into plain language</title>
        <meta name="description" content="DocuLix automates legal document analysis using AI to identify clauses, terms, and patterns. Making legal research faster, easier, and more reliable." />
        <link rel="icon" href="/favicon.ico" />
        {/* Add other meta tags, stylesheets, etc. as needed */}
      </Head>
      <Component {...pageProps} />
    </>
  )
}
