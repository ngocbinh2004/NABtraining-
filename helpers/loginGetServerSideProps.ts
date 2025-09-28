import type { NextApiRequest, NextApiResponse } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { routeAuthentication } from 'helpers/routeAuthentication'

export const getServerSideProps = async ({
  resolvedUrl,
  req,
  res,
  locale,
  defaultLocale,
}: {
  resolvedUrl: string
  res: NextApiResponse
  req: NextApiRequest
  locale: string
  defaultLocale: string
}) => {
  const hasAccess = routeAuthentication({
    resolvedUrl,
    req,
    res,
  })

  if (!hasAccess) {
    return {
      redirect: { destination: locale != defaultLocale ? `/${locale}/login` : '/login', permanent: false },
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
