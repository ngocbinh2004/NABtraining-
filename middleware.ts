import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const userAgent = request?.headers?.get('user-agent')
  if (!userAgent || userAgent?.toLowerCase().includes('postman')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const curReferer = request.headers.get('referer');
  const noReferer = !(curReferer?.includes('https://tpvl.tw') ||
                      curReferer?.includes('https://www.tpvl.tw') ||
                      curReferer?.includes('https://qa.d3ukedu8rb75m3.amplifyapp.com')||
                      curReferer?.includes('https://dev.d32qqtg8l8ruwr.amplifyapp.com')||
                      curReferer?.includes('https://www.vnemexaws.io.vn')||
                      curReferer?.includes('https://vnemexaws.io.vn'));
  if (!request.headers.get('referer')?.startsWith('http://localhost') && noReferer) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
