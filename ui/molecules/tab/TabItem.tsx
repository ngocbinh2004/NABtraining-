import { useState, useRef, useEffect } from 'react'
import { cx } from 'class-variance-authority'

import Line from '@/atoms/Line'
import Text from '@/atoms/Text'

interface TabProps {
  active?: boolean
  children?: React.ReactNode
  id?: string | number
  onClick: (...args: any) => any
}

function TabItemText({ onClick, active, children }: TabProps) {
  return (
    <button
      className={cx([
        'wl-tab__item-text',
        'bg-transparent outline-none',
        'text-tab-item',
        active ? 'active text-green' : 'inactive text-black',
      ])}
      role="button"
      onClick={onClick}
    >
      <Text breakWord="unset">{children}</Text>
      <Line classNames={cx(active ? 'visible' : 'invisible', 'mt-4')} />
    </button>
  )
}

function TabItemHorizontalBar({ onClick, active, children }: TabProps) {
  return (
    <button
      className={cx([
        'wl-tab__item-horizontal-bar w-full p-4',
        'bg-gray-800 outline-none border border-white/30',
        'text-tab-item',
        active ? 'active text-white' : 'inactive text-white-500',
      ])}
      role="button"
      onClick={onClick}
    >
      <Text breakWord="unset">{children}</Text>
    </button>
  )
}

function TabItemButton({ onClick, active = false, children, id }: TabProps) {
  const buttonRef = useRef<HTMLInputElement>(null)

  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (buttonRef?.current?.clientWidth) {
      setWidth(buttonRef?.current?.clientWidth - 1 || 0)
    }
  }, [buttonRef?.current?.clientWidth])

  return (
    <button
      role="button"
      onClick={onClick}
      className="wl-tab__item-button outline-none"
    >
      <div
        ref={buttonRef}
        className={cx(
          'text-white font-tab-item text-tab-item',
          'relative',
          'flex items-center justify-center px-[29px] py-[12.5px]',
          'bg-no-repeat	bg-contain'
        )}
      >
        {/* START: active background */}
        <svg
          className={`absolute ${active ? 'visible' : 'invisible'}`}
          width={width}
          viewBox={`0 0 ${width} 56`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter={`url(#filter0_d_50_3951-${id})`}>
            <rect
              x="4"
              width={width - 8 || 0}
              height="56"
              rx="28"
              fill={`url(#paint0_linear_50_3951-${id})`}
              shapeRendering="crispEdges"
            />
            <rect
              x="4.5"
              y="0.5"
              width={width - 7 || 0}
              height="55"
              rx="27.5"
              stroke={`url(#paint1_linear_50_3951-${id})`}
              shapeRendering="crispEdges"
            />
          </g>
          <defs>
            <filter
              id={`filter0_d_50_3951-${id}`}
              x="0"
              y="0"
              width={width}
              height="56"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_50_3951"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_50_3951"
                result="shape"
              />
            </filter>
            <linearGradient
              id={`paint0_linear_50_3951-${id}`}
              x1={`${Math.floor(width || 1 / 2)}`}
              y1="0"
              x2={`${Math.floor(width || 1 / 2)}`}
              y2="56"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#444444" />
              <stop offset="1" stopColor="#181818" />
            </linearGradient>
            {/* <linearGradient
              id={`paint1_linear_50_3951-${id}`}
              x1={width - 4 || 0}
              y1="-112.086"
              x2="2.3004"
              y2="-112.086"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.0510899" />
              <stop offset="0.490278" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient> */}
          </defs>
        </svg>

        {/* END: active background */}
        {/* START: inactive background */}
        {/* <svg
          className={`absolute ${active ? 'invisible' : 'visible'}`}
          width={width}
          height="56px"
          viewBox={`0 0 ${width} 56`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width={`${width - 1 || 0}`}
            height="55"
            rx="27.5"
            stroke={`url(#paint0_linear_50_3953-${id})`}
          />
          <defs>
            <linearGradient
              id={`paint0_linear_50_3953-${id}`}
              x1={width}
              y1="-112.086"
              x2="-1.45455"
              y2="-112.086"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.0510899" />
              <stop offset="0.490278" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg> */}
        {/* END: inactive background */}
        <Text classNames="z-10 w-full" breakWord="unset">
          {children}
        </Text>
      </div>
    </button>
  )
}

interface Props extends TabProps {
  type: 'button' | 'text' | 'horizontal-bar'
}

export default function TabItem({ type, ...props }: Props) {
  if (type === 'button') return <TabItemButton {...props} />
  if (type === 'text') return <TabItemText {...props} />
  if (type === 'horizontal-bar') return <TabItemHorizontalBar {...props} />

  return null
}
