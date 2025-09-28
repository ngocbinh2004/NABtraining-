import { useTranslation } from 'next-i18next'
import Text from '@/atoms/Text'
import Image from '@/molecules/media/Image'

export default function CardEmpty() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="w-1/8 flex justify-end">
        <Image
          classNames="min-w-[52px] w-[52px] min-h-[45px] h-[45px]"
          alt="star logo"
          url="/assets/yellow_star.png"
          imageClassNames="h-full rounded-t px-2 py-1"
          objectFit="object-contain"
        />
      </div>
      <div className="w-7/8">
        <Text
          size="unset"
          classNames="font-tertiary text-white text-center w-full text-[26px] leading-[30px] pt-[30px]"
        >
          {t('ComingSoon.title')}
        </Text>
      </div>
    </div>
  )
}