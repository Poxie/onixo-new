import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { AuthProvider } from '@/contexts/auth'
import { ConfimationProvider } from '@/contexts/confirmation'
import { MenuProvider } from '@/contexts/menu'
import { ModalProvider } from '@/contexts/modal'
import { ToastProvider } from '@/contexts/toast'
import { TooltipProvider } from '@/contexts/tooltip'
import { store } from '@/redux/store'
import '@/styles/globals.css'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const path = useRouter().pathname;
  const isDashboard = path.startsWith('/dashboard/[guildId]');
  
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return(
    <div className={inter['className']}>
      <Provider store={store}>
        <ToastProvider>
          <AuthProvider>
            <TooltipProvider>
              <ConfimationProvider>
                <ModalProvider>
                  <MenuProvider>
                    {!isDashboard && <Navbar />}
                    {getLayout(<Component {...pageProps} />)}
                    {!isDashboard && <Footer />}
                  </MenuProvider>
                </ModalProvider>
              </ConfimationProvider>
            </TooltipProvider>
          </AuthProvider>
        </ToastProvider>
      </Provider>
    </div>
  )
}
