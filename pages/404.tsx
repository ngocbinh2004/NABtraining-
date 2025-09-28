import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Image from '@/molecules/media/Image'

interface Props {}

export default function Page404({}: Props) {
  const { t } = useTranslation()
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center w-full py-10 mt-6 lg:mt-10 px-8 lg:px-32 border border-white boxBlurShadow">
        <Image
          alt="logo"
          url="/assets/white-logo-yellow-star.png"
          classNames="h-[40px] w-[115px] lg:h-[78px] lg:w-[225px]"
          imageClassNames="h-full w-full"
          objectFit="cover"
          quality={100}
        />
        <div className="mt-8 pt-8 lg:pt-16 w-full border-t border-gray-250">
          <p className="text-[28px] lg:text-[40px] font-semibold text-white text-center">
            404
          </p>
          <p className="text-white mt-4 lg:mt-6 font-normal text-center text-base lg:text-lg">
            {t('PageNotFound.content')}
          </p>
          <div className="mt-8 lg:mt-10 flex justify-center items-center h-12 w-full space-x-2">
            <Link href="/" className="w-full">
              <button className="text-white px-5 py-2 border border-white h-12 lg:h-[51px] w-full">
                <span className="font-semibold text-base lg:text-[18px] text-nowrap">
                  {t('PageNotFound.try_again')}
                </span>
              </button>
            </Link>
            <Link href="/" className="w-full">
              <button className="text-white px-5 py-2 bg-[#009919] h-12 lg:h-[51px] w-full">
                <span className="font-semibold text-base lg:text-[18px] text-nowrap">
                  {t('PageNotFound.back_to_home')}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center text-sm mt-5 mb-8">
        <span className="mx-1 text-white font-semibold text-base lg:text-lg">
          {t('PageNotFound.contact_content')}
        </span>
        <span className="text-white font-medium text-base lg:text-lg underline">
          {t('PageNotFound.contact')}
        </span>
        <span className="text-white font-semibold text-base lg:text-lg">
          {t('PageNotFound.end')}
        </span>
      </div>
    </div>
  )
}

export async function getStaticProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  }
}
