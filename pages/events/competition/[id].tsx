import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getCookie } from 'cookies-next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import type { NextApiResponse, NextApiRequest } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

//helper
import { beautifyDate } from 'helpers/beautifyDate'
import { getEvent, getRankTable, getRegisteredTeam } from 'helpers/api'
import { getTeamName } from 'helpers/getTeamName'

// context
import { useModalDispatch } from 'context/modalContext'

// ui
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import { TableHomeRecord } from '@/organisms/table/HomeRecord'
import CardWrapper from '@/organisms/card/Wrapper'
import CardTeam from '@/organisms/card/Team'
import CardSlider from '@/organisms/CardSlider'
import { EventInformation } from '@/components/PageTitle'

// constant
import { IRankTable } from 'interfaces/rank_table_type'
import { TModalAction, modalName } from 'constants/modal'
import { eventStatus } from 'constants/gameStatus'
import { Events } from 'interfaces/event_type'
import { IRegisteredTeam } from 'interfaces/registered_team_type'

interface Props {
  event: Events
  rankTable?: IRankTable[]
  canRegister?: boolean
  canUnregister?: boolean
  showRegisterNonLogin?: boolean
  showRegisterNonAdmin?: boolean
  isEventOpen?: boolean
  registeredTeams?: IRegisteredTeam[]
}

export default function CompetitionDetail({
  canUnregister,
  canRegister,
  event,
  isEventOpen,
  rankTable,
  registeredTeams,
  showRegisterNonAdmin,
  showRegisterNonLogin,
}: Props) {
  const { query, push, asPath } = useRouter()
  // Context
  const dispatch = useModalDispatch()
  // State
  const [page, setCurrentPage] = useState(1)
  // const uniqueDateTime = useMemo(() => {
  //   return Array.from(
  //     new Set(
  //       event?.matches?.map(
  //         (m: IMatches) =>
  //           `${beautifyDate(+m.start_date)}${
  //             m.location ? ' at ' + m.location : ''
  //           }`
  //       ) || []
  //     )
  //   ).join(', ')
  // }, [event])

  // Function
  const handleRegisterTeam = () => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.REGISTER_TEAM,
      data: { eventId: +`${query?.id}`, register: true },
    })
  }
  const handleUnRegisterTeam = () => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.REGISTER_TEAM,
      data: { eventId: +`${query?.id}`, register: false },
    })
  }
  const handleOpenEventRule = () => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.EVENT_RULES,
      data: { event },
    })
  }
  // @TODO: check whether user can regis or not
  // const handleRegisterNonAdmin = () => {
  // }
  const handleRegisterNewTeam = () => {
    push('/user/teams')
    // push(`/events/competition/register-team-member?event=${query?.id}`)
  }

  const handleRegisterNonLogin = () => {
    push('/login')
  }

  // Var
  const hasRankTable = rankTable && rankTable?.length > 0
  const hasMatch = event?.matches?.length > 0
  // UI
  if (!query?.id) return null

  return (
    <main className="wl-competition-detail container mx-auto mt-[56px]">
      <EventInformation
        eventName={event?.name}
        image={event?.image}
        status={event?.status}
      >
        <Button
          type="ghost"
          size="sm"
          onClick={handleOpenEventRule}
          classNames="w-fit"
        >
          View Rules
        </Button>
      </EventInformation>
      <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10">
        {isEventOpen && (canUnregister || canRegister) && (
          <div className="flex flex-col h-fit gap-4">
            {canUnregister && (
              <Button type="ghost" size="lg" onClick={handleUnRegisterTeam}>
                Unregister
              </Button>
            )}
            {canRegister && (
              <Button type="primary" size="lg" onClick={handleRegisterTeam}>
                Register Existing Team
              </Button>
            )}
            {/* Hide: register temporary */}
            {canRegister && (
              <Button type="primary" size="lg" onClick={handleRegisterNewTeam}>
                Register New Team
              </Button>
            )}
            {/* {showRegisterNonAdmin && (
              <Button type="primary" size="lg" onClick={() => null}>
                Join
              </Button>
            )} */}
          </div>
        )}
        {showRegisterNonLogin && (
          <Button type="primary" size="lg" onClick={handleRegisterNonLogin}>
            Join
          </Button>
        )}

        <div className="flex flex-col">
          <Text fontWeight="bold">Registration Period</Text>
          <Text>{`Start: ${
            event?.register_start_date
              ? beautifyDate(event?.register_start_date)
              : ''
          }`}</Text>
          <Text>{`End: ${
            event?.register_end_date
              ? beautifyDate(event?.register_end_date)
              : ''
          }`}</Text>
        </div>

        <div className="flex flex-col">
          <Text fontWeight="bold">Competition Period</Text>
          <Text>{`Start: ${
            event?.start_date ? beautifyDate(event?.start_date) : ''
          }`}</Text>
          <Text>{`End: ${
            event?.end_date ? beautifyDate(event?.end_date) : ''
          }`}</Text>
        </div>
      </div>
      {registeredTeams && registeredTeams?.length > 0 && (
        <div className="wl-event-competition__teams mb-10">
          <Text size="h2" classNames="my-4">
            Teams:
          </Text>
          <CardSlider classNames="lg:hidden" name="team">
            {registeredTeams?.map((team: IRegisteredTeam) => (
              <CardTeam
                url={team?.team?.logo}
                key={team?.team_id}
                content={getTeamName({
                  abbreviation: team?.team?.abbreviation,
                  name: team?.team?.name,
                })}
                handleSeeMore={() => push(`/events/teams/${team.team_id}`)}
              />
            ))}
          </CardSlider>

          <div className="hidden lg:grid grid-cols-3 gap-4">
            {registeredTeams?.map((team: IRegisteredTeam) => (
              <CardTeam
                url={team?.team?.logo}
                key={team?.team_id}
                content={getTeamName({
                  abbreviation: team?.team?.abbreviation,
                  name: team?.team?.name,
                })}
                handleSeeMore={() => push(`/events/teams/${team.team_id}`)}
              />
            ))}
          </div>
        </div>
      )}
      {(hasRankTable || hasMatch) && (
        <div className="flex flex-col gap-10">
          <Text size="h2" classNames="my-4">
            Matches:
          </Text>
          {hasRankTable && (
            <div className="wl-competition-detail__rank-table flex flex-col gap-6">
              {rankTable?.map((table: IRankTable) => (
                <CardWrapper key={table.id}>
                  <Text size="h2">{table?.name}</Text>
                  {/* <div className="grid md:grid-cols-5 gap-4 mt-4 w-full">
                    <Text classNames="md:col-span-3">Team</Text>
                    <Text classNames="hidden md:block">Won</Text>
                    <Text classNames="hidden md:block">Difference</Text>
                  </div>
                  {table?.teams?.map((team: IRankTableTeam) => (
                    <div
                      key={team.id}
                      className="grid md:grid-cols-5 gap-4 py-4"
                    >
                      <div className="flex items-center md:col-span-3">
                        {team.logo && (
                          <Image
                            classNames="mr-4"
                            width={24}
                            height={24}
                            url={team.logo}
                            alt={team.name}
                            isCircle
                          />
                        )}
                        <Text>{team.name}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text classNames="lg:hidden mr-4">Win:</Text>
                        <Text classNames="text-right">{team.stat?.won}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text classNames="lg:hidden mr-4">
                          Total Difference:
                        </Text>
                        <Text classNames="text-right">
                          {team.stat?.total_difference}
                        </Text>
                      </div>
                      <Line classNames="lg:hidden my-4" />
                    </div>
                  ))} */}
                  <div>
                    {table?.matches && table?.matches?.length > 0 && (
                      <TableHomeRecord records={table.matches} />
                    )}
                  </div>
                </CardWrapper>
              ))}
            </div>
          )}
          {hasMatch && (
            <CardWrapper>
              <TableHomeRecord
                records={event?.matches}
                page={{
                  size: 10,
                  current: page,
                  onChange: (page: number) => setCurrentPage(page),
                }}
              />
            </CardWrapper>
          )}
        </div>
      )}
    </main>
  )
}

export const getServerSideProps = async ({
  query,
  res,
  req,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
}) => {
  const eventId = query?.id
  // data
  const eventsResp = await getEvent(`?id=${eventId}`)
  const event = eventsResp?.data?.data?.[0]

  // const rankTableResp = await getRankTable(`?event_id=${eventId}`)
  // const rankTable = rankTableResp?.data?.data

  const registeredTeamsResp = await getRegisteredTeam(`?event_id=${eventId}`)
  const registeredTeams = registeredTeamsResp?.data?.data

  // if event not exist, return 404
  const noEvent = !event
  if (noEvent) {
    return {
      notFound: true,
    }
  }

  const eventOpen = event?.status === eventStatus.OPEN
  const pageProps = {
    event,
    // rankTable,
    registeredTeams,
    canRegister: false,
    canUnregister: false,
    isEventOpen: eventOpen,
  }

  // check if user can register / unregister
  // 1. not login = can not
  const sessionId = getCookie('SESSION', { req, res })
  const noAuth = !sessionId || typeof sessionId !== 'string'
  if (noAuth) {
    return {
      props: { ...pageProps, showRegisterNonLogin: eventOpen },
    }
  }

  // // NOTE: unregister currently disabled
  // const user = jwt.decode(sessionId) as JwtPayload
  // // 2. check has registered team & event status
  // const userRegisteredTeam =
  //   registeredTeams?.length > 0 &&
  //   registeredTeams.find(
  //     (teams: IRegisteredTeam) => teams.created_by === user.id
  //   )

  return {
    props: {
      ...pageProps,
      canRegister: eventOpen,
      canUnregister: false,
      // hide unregister due to requirements change
      // canUnregister: !!userRegisteredTeam && canUnregister(event?.status),
      ...(await serverSideTranslations(locale)),
    },
  }
}

const canUnregister = (status?: string) => {
  if (!status) return false

  const OPENED_FOR_UNREGISTER = [
    eventStatus.DRAFT,
    eventStatus.OPEN,
    eventStatus.CANCELED,
  ]
  return OPENED_FOR_UNREGISTER.includes(status)
}
