import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { AuthProvider } from '@/contexts/auth'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return(
    <div className={inter['className']}>
      <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </div>
  )
}
