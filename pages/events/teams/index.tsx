import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import type { NextApiResponse, NextApiRequest } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// helpers
import { getCategories, getEvent, getRegisteredTeam } from 'helpers/api'
import { getTeamName } from 'helpers/getTeamName'

// ui
import Text from '@/atoms/Text'
import Pagination from '@/molecules/Pagination'
import Tab from '@/molecules/tab/Tab'
import CardTeam from '@/organisms/card/Team'
import CardSlider from '@/organisms/CardSlider'

// constants
import { Events } from 'interfaces/event_type'
import { eventStatus } from 'constants/gameStatus'
import { IRegisteredTeam } from 'interfaces/registered_team_type'
import { ICategory } from 'interfaces/category_type'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))

interface IProps {
  events?: {
    data?: (Events & { teams?: IRegisteredTeam[] })[]
    total?: number
  }
  tabsHeader?: { name: string; id: any }[]
}

export default function TeamList({ events, tabsHeader }: IProps) {
  const { push, query } = useRouter()
  const { page = 1, category } = query

  return (
    <div className="wl-teams container mx-auto mt-[56px]">
      <Tab
        type="button"
        name="wl-teams-tab"
        onClick={(categoryId) => {
          push(`/events/teams?page=1&category=${categoryId}`)
        }}
        activeTab={parseInt(`${category}`) || tabsHeader?.[0]?.id}
        tabs={tabsHeader}
      >
        <div className=" w-full flex flex-col mt-12">
          <Pagination
            totalResult={events?.total || 0}
            size={PAGE_SIZE}
            page={+page}
            handleChange={(nextPage) =>
              push(`/events/teams?page=${nextPage}&category=${category}`)
            }
          />
          {events && events?.data && events?.data?.length > 0 ? (
            events?.data?.map((event) => (
              <div className="flex flex-col gap-2 mb-10" key={event?.id}>
                <Text
                  size="unset"
                  classNames="font-primary font-medium text-[36px] leading-[47px] mb-8"
                >
                  {event?.name}
                </Text>

                {event?.teams && event?.teams?.length > 0 ? (
                  <CardSlider
                    name={`slider-teams-${event?.category_id}`}
                    classNames="w-full h-full"
                    spaceBetween={24}
                  >
                    {event.teams.map(({ team, team_id }: IRegisteredTeam) => {
                      if (!team_id) return null
                      return (
                        <CardTeam
                          key={team_id}
                          url={team?.logo}
                          handleSeeMore={() => push(`/events/teams/${team_id}`)}
                          content={getTeamName({
                            abbreviation: team?.abbreviation,
                            name: team?.name,
                          })}
                          name={`${team_id}`}
                        />
                      )
                    })}
                  </CardSlider>
                ) : (
                  <div className="mt-12 w-full">
                    <EmptyResult text="there are no registered teams in the event yet" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="mt-12 w-full">
              <EmptyResult text="there are no recent event" />
            </div>
          )}
        </div>
      </Tab>
    </div>
  )
}

const PAGE_SIZE = 10
export const getServerSideProps = async ({
  res,
  query,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
}) => {
  const page = query?.page || 1

  const categories = await getCategories()
  const sortedCategories = categories?.data?.data?.sort(
    (a: ICategory, b: ICategory) => a.id - b.id
  )
  const categoryId =
    `${query?.category || ''}`?.length > 0 && !isNaN(+`${query?.category}`)
      ? query?.category
      : sortedCategories?.[0]?.id

  const events = await getEvent(
    `?limit=${PAGE_SIZE}&page=${page}&status=!${eventStatus.DRAFT}&category_id=${categoryId}`
  )
  let eventsTeam
  if (events?.data?.data?.length > 0) {
    eventsTeam = await Promise.all(
      events.data.data.map(async ({ matches, ...event }: Events) => {
        const registeredTeam = await getRegisteredTeam(`?event_id=${event?.id}`)
        return {
          ...event,
          teams: registeredTeam?.data?.data || [],
        }
      })
    )
  }

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      events: {
        data: eventsTeam || events?.data?.data || {},
        total: events?.data?.total || 0,
      },
      tabsHeader: sortedCategories,
      ...(await serverSideTranslations(locale)),
    },
  }
}
