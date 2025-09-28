import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import Text from '@/atoms/Text'
import TextArea from '@/molecules/form/TextArea'
import Input from '@/molecules/form/Input'
import Image from '@/molecules/media/Image'
import Button from '@/atoms/Button'
import { cx } from 'class-variance-authority'

export { getServerSideProps } from 'helpers/noLoginGetServerSideProps'
import { POST_NEW } from 'helpers/ssrRequest'
import { sendMailContactUs } from "../../helpers/api";

export default function ContactPage() {
  const { t } = useTranslation('langs')
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallScreen(window.innerWidth < 1024 && window.innerWidth > 768)
      setIsMediumScreen(window.innerWidth < 1440 && window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    setStatus('')
    e.preventDefault()

    let hasError = false
    const newErrors = { name: '', phone: '', email: '', message: '' }

    if (!name.trim()) {
      newErrors.name = t('ContactPage.error_required', {
        field: t('ContactPage.name'),
      })
      hasError = true
    }
    if (!phone.trim()) {
      newErrors.phone = t('ContactPage.error_required', {
        field: t('ContactPage.phone'),
      })
      hasError = true
    }
    if (!email.trim()) {
      newErrors.email = t('ContactPage.error_required', {
        field: t('ContactPage.email'),
      })
      hasError = true
    }
    if (!message.trim()) {
      newErrors.message = t('ContactPage.error_required', {
        field: t('ContactPage.message'),
      })
      hasError = true
    }

    setErrors(newErrors)
    if (hasError) {
      return
    }

    try {
      const subject = t('ContactPage.email_subject')
      // const body = `
      //   ${t('ContactPage.name')}: ${name}
      //   ${t('ContactPage.phone')}: ${phone}
      //   ${t('ContactPage.email')}: ${email}
      //   ${t('ContactPage.message')}: ${message}
      // `

      const body = { email, subject, name, phone, message };
      await sendMailContactUs(body)

      // Show success message
      setStatus('Your message has been sent successfully!')

      // Clear form after sending
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
    } catch (error) {
      setStatus('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="wl-home container mx-auto text-white">
      <div className={cx(
        'w-full border border-white background-card boxBlurShadow flex flex-col items-center mt-6 mb-6 pt-6 pb-6',
        isMobile
          ? 'pl-6 pr-6'
          : isSmallScreen
            ? 'pl-4 pr-4'
            : isMediumScreen
              ? 'pl-8 pr-8'
              : 'pl-20 pr-20',
      )}>
        <div className="w-full text-left mb-8">
          <h1 className="text-[24px] font-bold">
            {t('ContactPage.title')}
          </h1>
          <hr className="mt-2 border-t-1 border-white mx-auto w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <div>
            <Image
              url="/assets/contact-us.png"
              alt="Contact Us"
              width={
                isMobile
                  ? 280
                  : isSmallScreen
                    ? 320
                    : isMediumScreen
                      ? 450
                      : 516
              }
              height={
                isMobile
                  ? 64
                  : isSmallScreen
                    ? 80
                    : isMediumScreen
                      ? 90
                      : 116
              }
              classNames="w-full h-auto object-cover mb-2"
            />
            <div className={cx(
              'text-left bg-[#004f36] mt-8 mb-8 pt-2 pb-8 pl-4 pr-4',
              isMobile
                ? 'pl-2 pr-2'
                : isSmallScreen
                  ? 'pl-8 pr-8'
                  : isMediumScreen
                    ? 'w-[450px]'
                    : 'w-[516px]',
            )}>
              <p className={cx(
                'mb-6 text-white mt-2',
                isMobile || isSmallScreen ? 'text-[18px]' : 'text-[20px]'
              )}>
                {t('ContactPage.contact_message')}
              </p>
              <p className={cx(
                'mb-6 text-white',
                isMobile || isSmallScreen ? 'text-[16px]' : 'text-[18px]'
              )}>
                {t('ContactPage.contact_description')}
              </p>
              <hr className="mt-2 border-t-1 mb-6 border-white mx-auto w-full" />
              <div className="flex items-center space-x-2 mb-3">
                <Image
                  url="/assets/contact-us-mail-icon.png"
                  alt="Email"
                  width={20}
                  height={20}
                />
                <span className={cx(
                  'text-white pl-4',
                  isMobile || isSmallScreen ? 'text-[16px]' : 'text-[18px]'
                )}>{t('ContactPage.contact_email')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  url="/assets/contact-us-location-icon.png"
                  alt="Location"
                  width={20}
                  height={20}
                />
                <span className={cx(
                  'text-white pl-4',
                  isMobile || isSmallScreen ? 'text-[16px]' : 'text-[18px]'
                )}>{t('ContactPage.address')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <form onSubmit={handleSubmit}>
              {['name', 'phone', 'email', 'message'].map((field) => (
                <div key={field} className="mb-2">
                  <label
                    htmlFor={field}
                    className="font-bold font-base lg:font-semibold lg:text-[16px] mb-1 text-white block"
                  >
                    {t(`ContactPage.${field}`)}
                  </label>
                  {field !== 'message' ? (
                    <Input
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      value={eval(field)}
                      placeholder={t(`ContactPage.placeholder_${field}`)}
                      classNames="h-[30px] px-3 py-2 text-[16px] text-black mb-3 rounded-none"
                      onChange={(e) => {
                        const setter = {
                          name: setName,
                          phone: setPhone,
                          email: setEmail,
                        }[field] || setMessage
                        setter(e.target.value)
                        if (e.target.value.trim()) {
                          setErrors((prev) => ({ ...prev, [field]: '' }))
                        }
                      }}
                      required
                    />
                  ) : (
                    <TextArea
                      name={field}
                      value={message}
                      placeholder={t(`ContactPage.placeholder_${field}`)}
                      classNames="h-24 px-3 py-[10px] text-[16px] text-black mb-3 rounded-none"
                      onChange={(e) => {
                        setMessage(e.target.value)
                        if (e.target.value.trim()) {
                          setErrors((prev) => ({ ...prev, message: '' }))
                        }
                      }}
                      required
                    />
                  )}
                  {errors[field as keyof typeof errors] && (
                    <p className="text-red-500 text-sm mb-0.5">
                      {errors[field as keyof typeof errors]}
                    </p>
                  )}
                </div>
              ))}
              <Button
                classNames="bg-[#009919] rounded-none w-full mt-6"
                size="other"
                type="other"
              >
                <span className="text-[16px] text-white">
                  {t('ContactPage.btn_submit')}
                </span>
              </Button>
            </form>
            {status && (
              <p className="mt-3 text-center text-lg">{status}</p>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}
