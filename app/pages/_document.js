import { Html, Head, Main, NextScript } from 'next/document'
import Header from '../comonents/Header'

import { LogProvider } from "../context/log";

export default function Document() {

  return (
    
    <Html lang="en">
      <Head>
      <script defer src="https://unpkg.com/peerjs@1.3.2/dist/peerjs.min.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  
  )
}
