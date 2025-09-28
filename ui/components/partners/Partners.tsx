import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Image from '@/molecules/media/Image'
import Text from '@/atoms/Text'
import { IPartner } from 'interfaces/partner_type'
import { useEffect, useState } from "react"

interface PartnerSectionProps {
  partners: IPartner[]
}

export default function PartnerSection({ partners }: PartnerSectionProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const rowCols = isMobile ? 2 : isTablet ? 3 : 6

  useEffect(() => {
    const handleScreen = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleScreen(); // Initial check
    window.addEventListener('resize', handleScreen);
    return () => window.removeEventListener('resize', handleScreen);
  }, []);

  if (!partners || partners.length === 0) {
    return (
      <section className="wl-home__partners flex flex-col items-center mt-12">
        <div className="flex items-center w-full my-4">
          <div className="flex-1 border-t border-white"></div>
          <div className="flex items-center">
            <Image alt="Yellow Star" url="/assets/yellow_star.png" width={25} height={29} classNames="mx-4" />
            <h1 className="text-center font-semibold text-white text-2xl lg:text-[28px]">
              {t('MainPage.Partners.title')}
              {(!isMobile && router.locale !== 'en') && (
                <>
                  <br />
                  <span className="italic">Partners</span>
                </>
              )}
            </h1>
            <Image alt="Yellow Star" url="/assets/yellow_star.png" width={25} height={29} classNames="mx-4" />
          </div>
          <div className="flex-1 border-t border-white"></div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="w-1/8 flex justify-end">
            <Image
              classNames="min-w-[52px] w-[52px] min-h-[45px] h-[45px]"
              alt="news logo"
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
      </section>
    )
  }

  return (
    <section className="wl-home__partners flex flex-col items-center mt-12">
      <div className="flex items-center w-full my-4">
        <div className="flex-1 border-t border-white"></div>
        <div className="flex items-center">
          <Image alt="Yellow Star" url="/assets/yellow_star.png" width={25} height={29} classNames="mx-4" />
          <h1 className="text-center font-semibold text-white text-2xl lg:text-[28px]">
            {t('MainPage.Partners.title')}
            {(!isMobile && router.locale !== 'en') && (
              <>
                <br />
                <span className="italic">Partners</span>
              </>
            )}
          </h1>
          <Image alt="Yellow Star" url="/assets/yellow_star.png" width={25} height={29} classNames="mx-4" />
        </div>
        <div className="flex-1 border-t border-white"></div>
      </div>
      {Array.from({ length: Math.ceil(partners.length / rowCols) }).map(
        (_, rowIndex) => {
          const rowPartners = partners.slice(rowIndex * rowCols, rowIndex * rowCols + rowCols)
          const isLastRow = rowIndex === Math.floor(partners.length / rowCols)

          return (
            <div
              key={rowIndex}
              className={`${isLastRow && rowPartners.length < rowCols
                ? 'flex flex-wrap justify-center gap-2 mt-4 mb-4'
                : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 r mt-4 mb-4'
                }`}
            >
              {rowPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex justify-center items-center"
                >
                  <Image
                    alt={`Partner ${partner.id}`}
                    url={partner.logo || ""}
                    width={isMobile ? 120 : 160}
                    height={60}
                    objectFit="object-contain"
                    imageClassNames="h-[60px] w-[120px] md:w-[160px]"
                  />
                </div>
              ))}
            </div>
          )
        }
      )}
    </section>
  )
}