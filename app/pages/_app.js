import { LogProvider } from "../context/log"
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/global.css'
import '../styles/DebateH.css'
export default function App({ Component, pageProps }) {
  return <LogProvider><Component {...pageProps} /></LogProvider>
}
