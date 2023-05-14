import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { AuthProvider } from '@/contexts/auth'
import { store } from '@/redux/store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return(
    <div className={inter['className']}>
      <Provider store={store}>
        <AuthProvider>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </Provider>
    </div>
  )
}
