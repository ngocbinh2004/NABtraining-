import { Disclosure } from '@headlessui/react'
import { cx } from 'class-variance-authority'
import type { NextApiResponse } from 'next'

// helpers
import { getFaqs } from 'helpers/api'

// ui
import Text from '@/atoms/Text'
import Icon from '@/atoms/Icon'
import FaqLayout from '@/layout/FaqLayout'

// constants
import { IFaqs } from 'interfaces/faq_type'

interface IProps {
  faqs?: IFaqs[]
}
export default function Faq({ faqs = [] }: IProps) {
  return (
    <FaqLayout activeTab="general">
      <div className="wl-faq__content w-full">
        <dl className="mt-10 space-y-6 divide-y divide-gray-200/10 ">
          {faqs &&
            faqs.length > 0 &&
            faqs.map((faq) => (
              <Disclosure as="div" key={faq.id} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <Text classNames="wl-faq__item__answer text-white font-bold">
                          {faq.question}
                        </Text>
                        <span className="ml-6 flex h-7 items-center">
                          <Icon
                            classNames={cx(
                              'text-white',
                              open ? 'rotate-180 duration-100 ease-in' : ''
                            )}
                            icon="caret"
                            width={24}
                            height={24}
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <Text classNames="wl-faq__item__answer text-white">
                        {faq.answer}
                      </Text>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
        </dl>
      </div>
    </FaqLayout>
  )
}

export const getServerSideProps = async ({ res }: { res: NextApiResponse }) => {
  const faqs = await getFaqs()

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      faqs: faqs?.data?.data || [],
    },
  }
}
