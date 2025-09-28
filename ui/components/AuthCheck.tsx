import { hasCookie } from 'cookies-next'

import { AUTH_PATH, NO_AUTH_PATH } from 'constants/route'

export function getServerSideProps({ resolvedUrl }: { resolvedUrl: string }) {
  const isLogin = hasCookie('SESSION')

  const inPrivateRoute = AUTH_PATH.includes(resolvedUrl)
  const noPrivateAccess = !isLogin && inPrivateRoute

  const inNoAuthRoute = NO_AUTH_PATH.includes(resolvedUrl)
  const noNoAuthAccess = isLogin && inNoAuthRoute

  if (noPrivateAccess && noNoAuthAccess) {
    return {
      redirect: { destination: '/login', permanent: false },
    }
  }
}
