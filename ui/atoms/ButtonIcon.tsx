interface Props {
  ariaLabel?: string
  type?: string
  onClick: (...args: any[]) => any
}

export default function ButtonIcon({ type, onClick, ariaLabel }: Props) {
  if (type === 'increase')
    return <Increase onClick={onClick} ariaLabel={ariaLabel} />
  if (type === 'decrease')
    return <Decrease onClick={onClick} ariaLabel={ariaLabel} />
  return null
}

interface ButtonProps {
  ariaLabel?: string
  onClick: (...args: any[]) => void
}

function Decrease({ onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      className="wl-button-decrease outline-none"
      role="button"
      aria-label={ariaLabel || 'decrease'}
      onClick={onClick}
    >
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="34.4998"
          cy="34.5"
          r="23.5"
          fill="url(#paint0_linear_179_28503)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.0312 51.2652C27.2085 60.4426 42.0879 60.4426 51.2652 51.2652C60.4425 42.0879 60.4425 27.2085 51.2652 18.0312C42.0879 8.8539 27.2085 8.8539 18.0312 18.0312C8.85386 27.2085 8.85386 42.0879 18.0312 51.2652ZM17.3241 51.9723C26.8919 61.5402 42.4045 61.5402 51.9723 51.9723C61.5402 42.4045 61.5402 26.892 51.9723 17.3241C42.4045 7.75627 26.8919 7.75627 17.3241 17.3241C7.75623 26.892 7.75623 42.4045 17.3241 51.9723Z"
          fill="url(#paint1_linear_179_28503)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.3982 35.6484C23.3982 35.2342 23.734 34.8984 24.1482 34.8984H44.6482C45.0624 34.8984 45.3982 35.2342 45.3982 35.6484C45.3982 36.0627 45.0624 36.3984 44.6482 36.3984H24.1482C23.734 36.3984 23.3982 36.0627 23.3982 35.6484Z"
          fill="url(#paint2_linear_179_28503)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_179_28503"
            x1="34.4998"
            y1="11"
            x2="34.4998"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#444444" />
            <stop offset="1" stopColor="#181818" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_179_28503"
            x1="138.646"
            y1="-34.7012"
            x2="103.724"
            y2="-69.6233"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.0510899" />
            <stop offset="0.490278" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_179_28503"
            x1="45.3982"
            y1="31.8961"
            x2="23.2243"
            y2="31.8961"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.0510899" />
            <stop offset="0.490278" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  )
}

function Increase({ onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel || 'increase'}
      className="wl-button-increase outline-none"
      onClick={onClick}
      role="button"
    >
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="34.7963"
          cy="34.5"
          r="23.5"
          fill="url(#paint0_linear_179_28505)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.3277 51.2652C27.505 60.4426 42.3844 60.4426 51.5617 51.2652C60.739 42.0879 60.739 27.2085 51.5617 18.0312C42.3844 8.8539 27.505 8.8539 18.3277 18.0312C9.15037 27.2085 9.15037 42.0879 18.3277 51.2652ZM17.6206 51.9723C27.1884 61.5402 42.701 61.5402 52.2688 51.9723C61.8367 42.4045 61.8367 26.892 52.2688 17.3241C42.701 7.75627 27.1884 7.75627 17.6206 17.3241C8.05274 26.892 8.05274 42.4045 17.6206 51.9723Z"
          fill="url(#paint1_linear_179_28505)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.6947 35.6484C23.6947 35.2342 24.0305 34.8984 24.4447 34.8984H44.9447C45.3589 34.8984 45.6947 35.2342 45.6947 35.6484C45.6947 36.0627 45.3589 36.3984 44.9447 36.3984H24.4447C24.0305 36.3984 23.6947 36.0627 23.6947 35.6484Z"
          fill="url(#paint2_linear_179_28505)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.9447 24.3984C35.3589 24.3984 35.6947 24.7342 35.6947 25.1484L35.6947 45.6484C35.6947 46.0627 35.3589 46.3984 34.9447 46.3984C34.5305 46.3984 34.1947 46.0627 34.1947 45.6484L34.1947 25.1484C34.1947 24.7342 34.5305 24.3984 34.9447 24.3984Z"
          fill="url(#paint3_linear_179_28505)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_179_28505"
            x1="34.7963"
            y1="11"
            x2="34.7963"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#444444" />
            <stop offset="1" stopColor="#181818" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_179_28505"
            x1="138.942"
            y1="-34.7012"
            x2="104.02"
            y2="-69.6233"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.0510899" />
            <stop offset="0.490278" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_179_28505"
            x1="45.6947"
            y1="31.8961"
            x2="23.5208"
            y2="31.8961"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.0510899" />
            <stop offset="0.490278" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_179_28505"
            x1="38.697"
            y1="46.3984"
            x2="38.697"
            y2="24.2245"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.0510899" />
            <stop offset="0.490278" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  )
}
