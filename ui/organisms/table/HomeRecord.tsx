import { useMemo, useState } from 'react'
// helpers
import { getTeamName } from 'helpers/getTeamName'
import { beautifyDate } from 'helpers/beautifyDate'
// ui
import Button from '@/atoms/Button'
import Link from '@/atoms/Link'
import Text from '@/atoms/Text'
import { EventPill } from '@/atoms/Pill'
import Image from '@/molecules/media/Image'
import Tab from '@/molecules/tab/Tab'
import Table from '@/organisms/table/Table'

import { RecordRanking } from '@/components/PageTitle'
// constants
import { Events } from 'interfaces/event_type'
import { IMatches } from 'interfaces/match_type'

const TABLE_COLUMNS = [
  {
    key: 'team1',
    label: '',
    span: 3,
    render: ({ id, team1 }: IMatches) => {
      const team = getTeamName({
        abbreviation: team1?.abbreviation,
        name: team1?.name,
      })
      return (
        <td
          colSpan={3}
          className="hidden md:table-cell	 w-[30%]"
          key={`th-${id}-team1`}
        >
          <div className="wl-home__record__content__set flex items-center gap-1 md:gap-4">
            <div className="flex flex-col items-end justify-end w-full">
              <Text
                size="h2"
                classNames="font-primary text-h2 font-semibold text-right"
              >
                {team}
              </Text>
            </div>
            {team1?.logo && (
              <Image
                width={100}
                height={100}
                alt={team1?.name}
                url={team1?.logo}
                isCircle
                withZoom
              />
            )}
          </div>
        </td>
      )
    },
  },
  {
    key: 'match-detail',
    label: '',
    span: 3,
    render: (match: IMatches) => {
      const team1 = getTeamName({
        abbreviation: match?.team1?.abbreviation,
        name: match?.team1?.name,
      })

      const team2 = getTeamName({
        abbreviation: match?.team2?.abbreviation,
        name: match?.team2?.name,
      })

      return (
        <td
          colSpan={3}
          className="w-full md:w-[30%]"
          key={`th-${match?.id}-detail`}
        >
          <div className="wl-home__record__content__match relative flex flex-col md:flex-row md:mx-8 lg:mx-16 gap-2 md:gap-8 lg:gap-16 items-center justify-center">
            {match?.status && (
              <div className="md:hidden absolute top-[-15px] right-[10px]">
                <EventPill status={match?.status} />
              </div>
            )}
            <div className="wl-home__record__content__set__score mt-8 md:mt-0">
              <div className="md:hidden">
                {match?.team1?.logo && (
                  <Image
                    width={60}
                    height={60}
                    alt={team1}
                    url={match?.team1?.logo}
                    isCircle
                    classNames="mx-auto"
                    withZoom
                  />
                )}
              </div>
              <Text
                size="unset"
                classNames={`block md:hidden font-primary font-semibold my-2 ${
                  team1?.length <= 21 ? 'text-[36px]' : 'text-[24px]'
                }`}
              >
                {team1 ?? 'N/A'}
              </Text>
              <Text
                size="unset"
                classNames="font-primary font-semibold text-[24px] leading-[30px] md:text-[36px] md:leading-[47px]"
              >
                {match?.team1_win ?? 'N/A'}
              </Text>
            </div>
            <div className="wl-home__record__content__set__detail flex flex-col items-center">
              <Text size="body2" classNames="text-center">
                {match?.name}
              </Text>
              <Text size="body3" classNames="font-semibold text-center">
                {match?.location}
              </Text>
              <Text size="body4" classNames="font-normal text-center">
                {match?.start_date ? beautifyDate(+match.start_date) : ''}
              </Text>
              <Link href={`/game-record/${match?.id}`}>
                <Button size="sm" type="primary" classNames="mt-4">
                  See More
                </Button>
              </Link>
            </div>
            <div className="wl-home__record__content__set__score ">
              <Text
                size="unset"
                classNames="font-primary font-semibold text-[24px] leading-[30px] md:text-[36px] md:leading-[47px]"
              >
                {match?.team2_win}
              </Text>
              <Text
                size="unset"
                classNames={`block md:hidden font-primary font-semibold my-2 ${
                  team2?.length <= 21 ? 'text-[36px]' : 'text-[24px]'
                }`}
              >
                {team2 ?? 'N/A'}
              </Text>
              <div className="md:hidden">
                {match?.team2?.logo && (
                  <Image
                    width={60}
                    height={60}
                    alt={team2}
                    url={match?.team2?.logo}
                    isCircle
                    withZoom
                    classNames="mx-auto"
                  />
                )}
              </div>
            </div>
          </div>
        </td>
      )
    },
  },
  {
    key: 'team2',
    label: '',
    span: 3,
    render: ({ id, team2, status }: IMatches) => {
      const team = getTeamName({
        abbreviation: team2?.abbreviation,
        name: team2?.name,
      })
      return (
        <td
          colSpan={3}
          className="hidden md:table-cell	 w-[30%] relative"
          key={`th-${id}-${status}`}
        >
          {status && (
            <div className="absolute top-[-20px] right-0">
              <EventPill status={status} />
            </div>
          )}
          <div className="wl-home__record__content__set flex items-center gap-4">
            {team2?.logo && (
              <Image
                width={100}
                height={100}
                alt={team2?.name}
                url={team2?.logo}
                isCircle
                withZoom
              />
            )}
            <div className="flex flex-col items-start justify-start w-full">
              <Text size="h2" classNames="font-primary text-h2 font-semibold">
                {team}
              </Text>
            </div>
          </div>
        </td>
      )
    },
  },
]

export default function HomeRecord({ events }: { events: Events[] }) {
  // State
  const [selectedEvent, setSelectedEvent] = useState(events[0]?.id)

  const tabsHeader = useMemo(
    () => events.map(({ id, name }) => ({ name, id })),
    [events]
  )
  // Function
  const handleTabChange = (id: number) => setSelectedEvent(id)

  // Var
  const recordRangking = events.find((event) => event.id === selectedEvent)

  // UI
  if (!recordRangking) return null

  return (
    <section className="wl-home__record lg:col-span-3 mt-[18px] flex flex-col">
      <RecordRanking
        eventName={recordRangking.name}
        image={recordRangking.image}
        status={recordRangking?.status}
        title="Ranking Records"
      />
      <div className="wl-home__record__content">
        <Tab
          type="button"
          name="tab-record-ranking"
          onClick={(id) => handleTabChange(id)}
          activeTab={selectedEvent}
          tabs={tabsHeader}
        >
          <div className="hidden md:block">
            <Table
              columns={TABLE_COLUMNS}
              records={recordRangking?.matches}
              columnSize={9}
            />
          </div>

          <div className="block md:hidden">
            <Table
              columns={[TABLE_COLUMNS[1]]}
              records={recordRangking?.matches}
              columnSize={3}
            />
          </div>
        </Tab>
      </div>
    </section>
  )
}

export function TableHomeRecord({
  records,
  page,
}: {
  records: any
  page?: {
    size: number
    current: number
    onChange: (page: number) => any
  }
}) {
  if (!records) return null
  return (
    <Table
      columns={TABLE_COLUMNS}
      records={records}
      columnSize={9}
      page={page}
    />
  )
}
