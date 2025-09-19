import dynamic from 'next/dynamic'
import Head from 'next/head'

// Dynamically import App component to avoid SSR issues
const App = dynamic(() => import('../components/App'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <title>TJHS Sports Rental - The Jannali High School</title>
        <meta name="description" content="Sports equipment rental system for The Jannali High School students" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TJHS Rental" />
      </Head>
      <App />
    </>
  )
}
