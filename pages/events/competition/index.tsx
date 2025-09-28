import type { NextApiResponse } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// hooks
import { useEvents } from 'hooks/useEvents'

// helpers
import { getCategories } from 'helpers/api'

// context
import { useModalDispatch } from 'context/modalContext'

// ui
import Tab from '@/molecules/tab/Tab'
import Pagination from '@/molecules/Pagination'
import CardCompetition from '@/organisms/card/Competition'

// constants
import { Events } from 'interfaces/event_type'
import { TModalAction, modalName } from 'constants/modal'
import { eventStatus } from 'constants/gameStatus'
import { ICategory } from 'interfaces/category_type'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))

interface Props {
  categories?: ICategory[]
}

const PAGE_SIZE = 10

export default function CompetitionList({ categories }: Props) {
  const { push } = useRouter()
  // Context
  const dispatch = useModalDispatch()

  // State
  const [activeCategory, setActiveCategory] = useState<number>(
    categories?.[0]?.id || -1
  )
  const [page, setPage] = useState(1)

  const { data: events } = useEvents(
    `category_id=${activeCategory}&status=!${eventStatus.DRAFT}&limit=${PAGE_SIZE}&page=${page}`,
    !!activeCategory
  )

  // Function
  const handleRegisterTeam = (eventId: number) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.REGISTER_TEAM,
      data: { eventId, register: true },
    })
  }

  // Var
  const tabsHeader = categories

  return (
    <div className="wl-competition container mx-auto mt-[56px]">
      <Tab
        type="text"
        name="wl-competition__category-tab"
        onClick={(id) => {
          setActiveCategory(id)
          setPage(1)
        }}
        activeTab={activeCategory}
        tabs={tabsHeader}
      >
        <div className="flex flex-col gap-4 mt-6" key={activeCategory}>
          <Pagination
            totalResult={events?.total}
            size={PAGE_SIZE}
            page={page}
            handleChange={setPage}
          />
          {events && events?.data?.length > 0 ? (
            <div className="wl-competition__category-content grid grid-cols-1 lg:grid-cols-2 gap-4 mt-12">
              {events?.data?.map((ev: Events) => (
                <CardCompetition
                  status={ev.status}
                  key={ev.id}
                  url={ev.image}
                  handleMore={() => push(`/events/competition/${ev.id}`)}
                  handleRegister={() => handleRegisterTeam(ev.id)}
                  title={ev.name}
                  content={ev.description || ''}
                  isOpen={ev.status === 'OPEN'}
                />
              ))}
            </div>
          ) : (
            <div className="w-full mt-12">
              <EmptyResult text="there are no recent events" />
            </div>
          )}
        </div>
      </Tab>
    </div>
  )
}

export const getServerSideProps = async ({ res, locale }: { res: NextApiResponse, locale: string }) => {
  const categories = await getCategories()
  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      categories: categories?.data?.data?.sort(
        (a: ICategory, b: ICategory) => a.id - b.id
      ),
      ...(await serverSideTranslations(locale, ['langs'])),
    },
  }
}
