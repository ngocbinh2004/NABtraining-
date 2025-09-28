import { useRouter } from 'next/router'
// hooks
import { useProfile } from 'hooks/useProfile'
// ui
import Text from '@/atoms/Text'
import Tab from '@/molecules/tab/Tab'

interface Props {
  activeTab: string
  children?: React.ReactNode
}

const TAB_HEADER = [
  { id: 'purchased', name: 'Purchased' },
  { id: 'unpaid', name: 'Unpaid' },
  { id: 'favorite', name: 'Favorite' },
]

export default function TicketLayout({ activeTab, children }: Props) {
  const { push } = useRouter()
  const { data: profile } = useProfile('', true)

  const user = profile?.data?.[0]

  return (
    <div className="wl-tickets container mx-auto mt-[47px] flex flex-col justify-start gap-10">
      <div className="w-full lg:px-[100px]">
        <Text
          size="h1"
          classNames="text-white lg:w-[80%] lg:mx-auto mb-12 text-left capitalize"
        >
          Hi {user?.name}!<br />
          Here are all your tickets.
        </Text>
      </div>

      <Tab
        type="text"
        name="tab-tickets"
        onClick={(id) => push(`/my-tickets/${id}`)}
        activeTab={activeTab}
        tabs={TAB_HEADER}
      >
        <div className="mt-12">{children}</div>
      </Tab>
    </div>
  )
}
