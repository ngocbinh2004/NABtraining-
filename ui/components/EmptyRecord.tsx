import Text from '@/atoms/Text'

export default function EmptyResult({
  text = 'there are no records yet.',
}: {
  text?: string
}) {
  return (
    <div className="flex items-center w-full">
      <div className="flex w-full flex-col items-center justify-center lg:flex-row gap-12">
        <svg
          width={85}
          height={85}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M33.507 54.101c3.408-3.222 6.06-7.075 7.67-11.32-4.815-5.892-7.607-13.59-7.873-21.766-.245-7.516 1.652-14.823 5.375-20.84a41.72 41.72 0 0 0-16.32 4.903 43.321 43.321 0 0 0-3.346 16.736c-.007 12.406 5.27 24.133 14.494 32.287Z"
            fill="url(#a)"
          />
          <path
            d="M20.645 61.821c4.136-1.422 7.894-3.538 11.099-6.172-9.588-8.588-15.06-20.868-15.06-33.842 0-5.079.825-10.045 2.456-14.809a42.656 42.656 0 0 0-7.544 6.347 42.543 42.543 0 0 0-7.377 10.704 43.672 43.672 0 0 0 3.409 20.974A42.797 42.797 0 0 0 20.645 61.82Z"
            fill="url(#b)"
          />
          <path
            d="M47.503 7.664c10.078 0 19.813 2.844 28.043 8.119a42.883 42.883 0 0 0-11.4-9.864A42.419 42.419 0 0 0 42.505 0c-.294 0-.595.007-.93.014-1.82 2.613-3.24 5.527-4.241 8.63a53.38 53.38 0 0 1 10.168-.98Z"
            fill="url(#c)"
          />
          <path
            d="M78.618 65.007a36.65 36.65 0 0 0-5.71-9.464 45.056 45.056 0 0 1-12.576 20.231A45.63 45.63 0 0 1 45.453 85a42.392 42.392 0 0 0 18.252-5.562 42.836 42.836 0 0 0 14.913-14.431Z"
            fill="url(#d)"
          />
          <path
            d="M84.932 45.202C80.677 39.297 74.897 34.4 68.2 31.024c-6.837-3.447-14.563-5.268-22.339-5.268-3.156 0-6.333.294-9.461.883l-.126.02c1.042 5.423 3.303 10.424 6.592 14.501a30.485 30.485 0 0 1 4.99-.413c6.984 0 13.87 2.347 19.931 6.774 5.235 3.832 9.532 9.086 12.275 14.97a42.52 42.52 0 0 0 4.871-17.289Z"
            fill="url(#e)"
          />
          <path
            d="M8.979 63.803c3.002 0 6.012-.392 8.965-1.163A45.3 45.3 0 0 1 5.487 45.947a45.867 45.867 0 0 1-3.688-15.699A42.365 42.365 0 0 0 0 42.549a42.554 42.554 0 0 0 5.578 21.086c1.12.112 2.26.168 3.4.168Z"
            fill="url(#f)"
          />
          <path
            d="M36.62 11.174a36.524 36.524 0 0 0-.986 9.765c.035 1.15.126 2.291.273 3.419l.063-.014a53.455 53.455 0 0 1 9.888-.925c8.14 0 16.222 1.905 23.389 5.52C75.37 32.022 80.759 36.323 85 41.48a42.534 42.534 0 0 0-5.473-19.846C70.744 14.13 59.38 9.997 47.503 9.997c-3.64 0-7.3.392-10.883 1.177Z"
            fill="url(#g)"
          />
          <path
            d="M37.63 84.82a43.382 43.382 0 0 0 21.12-10.76 42.785 42.785 0 0 0 12.318-20.574 35.626 35.626 0 0 0-4.654-4.07 34.451 34.451 0 0 0-5.34-3.223c-3.177 8.848-8.916 16.372-16.628 21.773a45.777 45.777 0 0 1-26.244 8.273 46.64 46.64 0 0 1-1.707-.035 42.535 42.535 0 0 0 8.272 5.023A42.05 42.05 0 0 0 37.63 84.82Z"
            fill="url(#h)"
          />
          <path
            d="M43.107 66.052C50.47 60.896 55.935 53.71 58.93 45.247c-3.583-1.43-7.32-2.165-11.078-2.165-1.484 0-2.974.12-4.437.35-1.778 4.764-4.794 9.17-8.748 12.77-3.905 3.56-8.706 6.334-13.885 8.029l-.573.182a37.885 37.885 0 0 1-11.233 1.716c-.63 0-1.26-.014-1.89-.049a42.923 42.923 0 0 0 6.404 7.566 44.08 44.08 0 0 0 4.703.252c4.472 0 8.902-.686 13.164-2.038a43.169 43.169 0 0 0 11.75-5.808Z"
            fill="url(#i)"
          />
          <defs>
            <linearGradient
              id="a"
              x1={30.095}
              y1={0.175}
              x2={30.095}
              y2={54.101}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="b"
              x1={17.904}
              y1={6.998}
              x2={17.904}
              y2={61.821}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="c"
              x1={56.44}
              y1={0}
              x2={56.44}
              y2={15.783}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="d"
              x1={62.036}
              y1={55.543}
              x2={62.036}
              y2={85}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="e"
              x1={60.602}
              y1={25.756}
              x2={60.602}
              y2={62.491}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="f"
              x1={8.972}
              y1={30.248}
              x2={8.972}
              y2={63.803}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="g"
              x1={60.306}
              y1={9.997}
              x2={60.306}
              y2={41.479}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="h"
              x1={43.781}
              y1={46.193}
              x2={43.781}
              y2={84.82}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="i"
              x1={33.008}
              y1={43.082}
              x2={33.008}
              y2={73.898}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" />
              <stop offset={1} stopColor="ivory" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
        <Text
          fontWeight="normal"
          classNames="text-center lg:text-left"
          size="body3"
        >
          Sorry,
          <br />
          {text}
        </Text>
      </div>
    </div>
  )
}
