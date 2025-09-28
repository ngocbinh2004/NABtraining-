import { cx } from 'class-variance-authority'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'

import VerticalSteps from '@/molecules/VerticalSteps'

import CardWrapper from '@/organisms/card/Wrapper'

interface Props {
  isActive?: boolean
  resendEmail: (...args: any) => any
}

export default function FourthStep({ isActive, resendEmail }: Props) {
  const { push } = useRouter()
  const { t } = useTranslation()
  const redirectToLogin = () => push('/login')

  return (
    <div
      className={cx(
        'form-register-fourth',
        isActive ? '' : 'hidden',
        'container mx-auto mt-[56px]',
        'flex flex-col items-center'
      )}
    >
      <CardWrapper
        classNames={cx(
          'form-register-fourth__form',
          'w-full lg:w-1/2 lg:w-[700px]',
          'flex flex-col p-8 lg:py-[56px] lg:px-[135px] '
        )}
      >
        <Text size="form-title" classNames="text-center" component="h1">
          {t('SignUp.Page4.welcome')}
        </Text>
        <Line classNames="w-[50%] mt-6 mb-8" />
        <div className="w-full lg:w-[427px] mb-8">
          <VerticalSteps
            steps={[
              t('SignUp.Page4.content1'),
              t('SignUp.Page4.content2'),
            ]}
          />
        </div>

        <Text
          component="label"
          size="list-item"
          classNames="text-black mb-2"
        >
          {t('SignUp.Page4.content3')}
        </Text>
        <Text
          component="label"
          size="list-item"
          classNames="text-black mb-2">

        </Text>
        <span
          role="button"
          aria-label="Resend verification letter"
          onClick={resendEmail}
        >
          <Text
            component="label"
            size="list-item"
            fontWeight="semibold"
            classNames=" cursor-pointer"
            decoration="underline"
          >
            {t('SignUp.verify_now')}
          </Text>
        </span>
        <div className="mt-12 text-center">
          <Button
            size="xl"
            type="primary"
            onClick={redirectToLogin}
            role="button"
          >
            {t('SignUp.btn_goto_login')}
          </Button>
        </div>
      </CardWrapper>
    </div>
  )
}
