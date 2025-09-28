/** @type {import('next').NextConfig} */
const { version } = require('./package.json')
const { loadEnvConfig } = require('@next/env')
const { i18n } = require('./next-i18next.config')

loadEnvConfig('.')

const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    version,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/uc?**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname:
          '/wikipedia/commons/thumb/b/bf/Algeria_and_Japan_women%27s_national_volleyball_team_at_the_2012_Summer_Olympics_%287913959028%29.jpg/1200px-Algeria_and_Japan_women%27s_national_volleyball_team_at_the_2012_Summer_Olympics_%287913959028%29.jpg',
      },
      {
        protocol: 'https',
        hostname: 'way-li.s3.ap-southeast-1.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
        port: '',
        pathname:
          '/b/colorful-rocks-salthill-beach-focus-blackrodk-diving-board-out-sun-rise-time-flare-cloudy-sky-nobody-galway-city-ireland-217606320.jpg',
      },
      {
        protocol: "https",
        hostname: "assets.manutd.com",
        port: '',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vlw-s3-qa-test.s3.ap-southeast-1.amazonaws.com",
        port: '',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    // https://nextjs.org/docs/advanced-features/security-headers
    return [
      {
        source: '/:path*',
        headers: [
          // This header indicates whether the site should be allowed to be displayed within an iframe
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // This header prevents the browser from attempting to guess the type of content if the Content-Type header is not explicitly set
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          //  how much information the browser includes when navigating from the current website (origin) to another.
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  poweredByHeader: false,
  env: {
    NEXT_AWS_REGION: process.env.NEXT_AWS_REGION,
    NEXT_AWS_ACCESS_KEY_ID: process.env.NEXT_AWS_ACCESS_KEY_ID,
    NEXT_AWS_SECRET: process.env.NEXT_AWS_SECRET,
    NEXT_AWS_BUCKET: process.env.NEXT_AWS_BUCKET,
  },
}

module.exports = nextConfig
