import { SwiperSlide } from 'swiper/react'

import TabItem from '@/molecules/tab/TabItem'
import TabHeader from '@/molecules/tab/TabHeader'
import TabItemEvent from '@/molecules/tab/TabItemEvent'

export interface Props {
  activeTab?: string | number
  type: 'button' | 'text' | 'event' | 'horizontal-bar'
  name: string
  tabs?: {
    id: string | number
    name: string
    title?: string
    subtitle?: string
    image?: string
  }[]
  onClick: (...args: any) => any
  children: React.ReactNode
}

export default function Tab({
  activeTab,
  name,
  onClick,
  tabs,
  type,
  children,
}: Props) {
  if (!tabs) return null

  return (
    <div className="w-full text-center" id={name}>
      <TabHeader
        type={type}
        name={name}
        slidePerView={type === 'event' ? 1 : undefined}
      >
        <>
          {tabs.map(({ id, name, ...rest }) => (
            <SwiperSlide key={id} className="w-fit">
              {type !== 'event' ? (
                <TabItem
                  type={type}
                  onClick={() => onClick(id)}
                  id={id}
                  active={activeTab === id}
                  {...rest}
                >
                  {name}
                </TabItem>
              ) : (
                <TabItemEvent
                  onClick={() => onClick(id)}
                  id={id}
                  active={activeTab === id}
                  {...rest}
                />
              )}
            </SwiperSlide>
          ))}
        </>
      </TabHeader>
      {children}
    </div>
  )
}
