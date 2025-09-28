import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Image from '@/molecules/media/Image'
import { FiPhoneCall } from "react-icons/fi"

interface Props { }

export default function ExpiredToken({ }: Props) {
    const { t } = useTranslation()
    return (
        <div className="flex flex-col items-center justify-center px-4">
            <div
                className="bg-white flex flex-col items-center justify-center w-full sm:w-3/4 lg:w-1/2 mt-20 mb-8 pt-10 pb-10 px-4 sm:px-10 relative">
                <div className="absolute top-0 left-0 w-24 h-16">
                    <Image
                        alt="white-logo"
                        url="/assets/white-logo.png"
                        classNames='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24'
                        quality={100}
                    />
                </div>
                <Image
                    alt="logo"
                    url="https://vlw-s3-qa1.s3.ap-southeast-2.amazonaws.com/TPVL_new_logo.png"
                    height={60}
                    width={170}
                />
                <div className="mt-7 w-2/3 border-t border-gray-250"></div>
                <h1 className="text-[48px] font-bold mt-12">{t('ExpiredToken.expired')}</h1>
                <p className="text-[#525252] mt-5">{t('ExpiredToken.title')}</p>
                <p className="text-[#525252]">{t('ExpiredToken.content')}</p>
                <p className="text-[#525252]">{t('ExpiredToken.request')}</p>
                <div className="mt-10 flex space-x-5">
                    <Link href="/">
                        <button className="border border-[#004F36] text-[#004F36] text-[18px] px-5 py-2 bg-white">
                            {t('ExpiredToken.try_again')}
                        </button>
                    </Link>
                    <Link href="/">
                        <button className="border border-[#004F36] text-white text-[18px] px-5 py-2 background-green">
                            {t('ExpiredToken.back_to_home')}
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-center text-sm mt-5 mb-8 text-[#525252]">
                <FiPhoneCall className="mr-2 text-green" />
                <span className="mx-1 text-green font-bold text-sm">{t('ExpiredToken.contact')}</span> {t('ExpiredToken.contact_content')}
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
