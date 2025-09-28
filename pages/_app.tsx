import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import localFont from '@next/font/local'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { UserConfig } from 'next-i18next'
import i18NextConfig from '../next-i18next.config'
import { useTranslation } from 'next-i18next'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ToastContainer } from 'react-toastify'
import NProgress from 'nprogress'
import dynamic from 'next/dynamic'
// context
import { TicketsProvider } from 'context/ticketContext'
import { ModalsProvider } from 'context/modalContext'
// ui
import Footer from '@/organisms/Footer'
import Header from '@/organisms/Header'
import ErrorBoundary from '@/components/ErrorBoundary'
import VersionLogger from '@/components/VersionLogger'
// constants
import { HIDE_TICKET_PATH } from 'constants/route'
import 'nprogress/nprogress.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/globals.css'
import { cx } from 'class-variance-authority'

const i18nConfig: UserConfig = {
  i18n: {
    defaultLocale: i18NextConfig.i18n.defaultLocale,
    locales: i18NextConfig.i18n.locales,
  },
  defaultNS: i18NextConfig.defaultNS,
}

const ModalManager = dynamic(() => import('@/organisms/ModalManager'))

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  const showTicket = !HIDE_TICKET_PATH?.some((ticket: string) =>
    `${router?.pathname}`.startsWith(ticket)
  )

  // show progress bar on route change
  useEffect(() => {
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteDone)
    router.events.on('routeChangeError', handleRouteDone)

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteDone)
      router.events.off('routeChangeError', handleRouteDone)
    }
  }, [router])
  return (
    <main
      className={cx(
        router.locale == 'cn'
          ? `${notosanstc.variable} font-notosanstc`
          : `${counTach.variable} font-countach`,
        `flex flex-col justify-between min-h-screen`
      )}
    >
      <Head>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="TPVL, volleyball, competition" />
        <meta name="author" content="VNEMEX" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="TPVL" />
        <meta name="theme-color" content="#414141" />
        <meta name="app-version" content={process.env.NEXT_PUBLIC_APP_VERSION || 'development'} />
        <title>{t('MainPage.Title.name')}</title>
      </Head>

      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Header />
          <ToastContainer autoClose={6000} />
          <div className="h-[56px] lg:h-[72px] w-full" />
          <div className="flex-grow">
            <ModalsProvider>
              <TicketsProvider>
                <Component {...pageProps} />
                <VersionLogger />
                <ModalManager />
              </TicketsProvider>
            </ModalsProvider>
          </div>
          <Footer />
        </QueryClientProvider>
      </ErrorBoundary>
    </main>
  )
}

const counTach = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/English/Countach-Light-TRIAL-BF63c5f208a6fb6.otf',
      weight: '400',
      style: 'light',
    },
    {
      path: './fonts/English/Countach-Regular-TRIAL-BF63c5f207736f1.otf',
      weight: '500',
      style: 'regular',
    },
    {
      path: './fonts/English/Countach-Bold-TRIAL-BF63c5f2076e572.otf',
      weight: '600',
      style: 'bold',
    },
  ],
  variable: '--font-countach',
})

const notosanstc = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/Chinese/NotoSansTC-Light.ttf',
      weight: '400',
      style: 'light',
    },
    {
      path: './fonts/Chinese/NotoSansTC-Regular.ttf',
      weight: '500',
      style: 'regular',
    },
    {
      path: './fonts/Chinese/NotoSansTC-Bold.ttf',
      weight: '600',
      style: 'bold',
    },
  ],
  variable: '--font-notosanstc',
})

const ibmPlexSans = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/IBM Plex Sans/IBMPlexSans-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
    {
      path: './fonts/IBM Plex Sans/IBMPlexSans-Medium.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: './fonts/IBM Plex Sans/IBMPlexSans-Regular.woff2',
      weight: '400',
      style: 'regular',
    },
  ],
  variable: '--font-ibm',
})

const pingFangTC = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/Ping Fang TC/PingFang-Regular.woff2',
      weight: '400',
      style: 'light',
    },
    {
      path: './fonts/Ping Fang TC/PingFang-Regular.woff2',
      weight: '500',
      style: 'regular',
    },
    {
      path: './fonts/Ping Fang TC/PingFang-Regular.woff2',
      weight: '600',
      style: 'semibold',
    },
  ],
  variable: '--font-ping-fang',
})

const rubik = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/Rubik/Rubik-VariableFont_wght.ttf',
      weight: '400',
    },
    {
      path: './fonts/Rubik/Rubik-VariableFont_wght.ttf',
      weight: '500',
    },
    {
      path: './fonts/Rubik/Rubik-VariableFont_wght.ttf',
      weight: '600',
    },
  ],
  variable: '--font-rubik',
})

const zeitung = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/Zeitung Pro/Zeitung Pro Black.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Zeitung Pro/Zeitung Pro Black.ttf',
      weight: '500',
      style: 'semibold',
    },
    {
      path: './fonts/Zeitung Pro/Zeitung Pro Black.ttf',
      weight: '600',
      style: 'bold',
    },
  ],
  variable: '--font-zeitung',
})

export default appWithTranslation(App, i18nConfig)
