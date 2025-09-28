import { useRouter } from 'next/router'
// hooks
import { useProfile } from 'hooks/useProfile'
// helpers
import { userId } from 'helpers/cookie'
// ui
import Text from '@/atoms/Text'
import Tab from '@/molecules/tab/Tab'

interface Props {
  activeTab: string
  children?: React.ReactNode
}

const TABS_HEADER = [
  { id: 'profile', name: 'Profile' },
  { id: 'teams', name: 'Teams' },
  { id: 'events', name: 'Events' },
  // @TODO: show order when it is done
  // { id: 'order', name: 'Orders' },
]

export default function UserLayout({ activeTab, children }: Props) {
  const { push } = useRouter()

  // Query
  const { data: profile } = useProfile(`id=${userId()}`, !!userId())

  // Var
  const user = profile?.data?.[0]

  // UI
  if (!user) return null

  return (
    <div
      className="wl-user container mx-auto mt-[47px] flex flex-col justify-start gap-10"
      key={user.id}
    >
      <div className="w-full lg:px-[100px]">
        <Text
          size="h1"
          classNames="text-white lg:w-[80%] lg:mx-auto mb-12 text-left capitalize"
        >
          Hi {profile?.data?.[0]?.name}!
        </Text>
      </div>
      <Tab
        type="text"
        name="tab-user"
        onClick={(id: string) => push(`/user/${id}`)}
        activeTab={activeTab}
        tabs={TABS_HEADER}
      >
        <div className="mt-12">{children}</div>
      </Tab>
    </div>
  )
}
