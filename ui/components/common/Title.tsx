import React from 'react'
import { useRouter } from 'next/router'
import Icon from '@/atoms/Icon'

type TitleProps = {
  title_text: string
  fallback?: string
  isMobile: boolean
}

// The page title appears as 聯盟公告(title_text) / Announcement(fallback) in Chinese.
export default function Title({ title_text, fallback, isMobile = false }: TitleProps) {
  const router = useRouter()
  const isCN = router.locale === 'cn'

  return (
    <>
      <Icon
        icon="referee-icon"
        width={isMobile ? 14 : 24.89}
        height={isMobile ? 16 : 28.44}
        classNames="shrink-0"
      />
      <p
        className={`text-white text-[20px] lg:text-[28px] ml-2 my-4 font-bold`}
      >
        {title_text}
        {!isMobile && isCN && fallback && (
          <>
            <span className="font-thin"> / </span>
            <span className="italic">{fallback}</span>
          </>
        )}
      </p>
    </>
  )
}
