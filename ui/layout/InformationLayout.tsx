import { useRouter } from 'next/router'

import Tab from '@/molecules/tab/Tab'

import { InformationList } from '@/components/PageTitle'

interface Props {
  title: string
  activeTab?: string
  children?: React.ReactNode
}

const TAB_HEADER = [
  { id: 'news', name: 'News' },
  { id: 'video', name: 'Video' },
  { id: 'photo', name: 'Photo' },
]

export default function InformationLayout({
  title,
  activeTab,
  children,
}: Props) {
  const { push } = useRouter()

  // UI
  if (!activeTab) return null

  return (
    <div className="wl-information container mx-auto">
      <InformationList title={title} type={activeTab} />
      <Tab
        type="text"
        name="tab-text"
        onClick={(id) => push(`/information/${id}`)}
        activeTab={activeTab}
        tabs={TAB_HEADER}
      >
        <div className="mt-12">{children}</div>
      </Tab>
    </div>
  )
}
