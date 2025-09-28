import { useRouter } from 'next/router'
// ui
import Text from '@/atoms/Text'
import Tab from '@/molecules/tab/Tab'
import Contact from '@/organisms/Contact'

interface Props {
  activeTab: string
  children?: React.ReactNode
}

const TABS_HEADER = [
  { id: 'general', name: 'General' },
  { id: 'team', name: 'Teams' },
  // { id: 'event', name: 'Events' },
]

export default function FaqLayout({ activeTab, children }: Props) {
  const { push } = useRouter()

  return (
    <div
      className="wl-faq container mx-auto mt-[47px] flex flex-col justify-start gap-10"
      key={activeTab}
    >
      <Text size="h1" classNames="text-center">
        Frequently asked questions
      </Text>
      {/* <Tab
        type="horizontal-bar"
        name="tab-faq"
        onClick={(id: string) => push(`/faq/${id}`)}
        activeTab={activeTab}
        tabs={TABS_HEADER}
      > */}
        <div className="mt-12 text-left">{children}</div>
      {/* </Tab> */}
      <Contact />
    </div>
  )
}
