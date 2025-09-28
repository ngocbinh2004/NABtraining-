import { getCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// hooks
import { useUserEvents } from 'hooks/useUserEvents'
// helpers
import { routeAuthentication } from 'helpers/routeAuthentication'
import { getUserEvents } from 'helpers/api'
// context
import { useModalDispatch } from 'context/modalContext'
// ui
import ButtonIcon from '@/atoms/ButtonIcon'
import UserLayout from '@/layout/UserLayout'
import EventList from '@/components/profile/games/EventList'
// constants
import { modalName, TModalAction } from 'constants/modal'
// import { SITE_ROLE } from 'constants/role'
import { IUserEvent } from 'interfaces/user_event_type'

interface IProps {
  user: number
  initialUserEvents?: {
    data?: IUserEvent[]
  }
  canAdd?: boolean
}

export default function UserEvents({
  user,
  initialUserEvents,
  canAdd,
}: IProps) {
  // Context
  const dispatch = useModalDispatch()
  // Query
  const { data: userEvents, isSuccess: isFetchEventSuccess } = useUserEvents(
    '',
    !!user,
    initialUserEvents
  )

  // Function
  const handleEditEvent = (eventId: number) => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.EDIT_EVENT,
      data: { eventId: eventId },
    })
  }
  const handleAddEvent = () => {
    dispatch({
      type: TModalAction.PUSH,
      name: modalName.EDIT_EVENT,
      data: {},
    })
  }

  return (
    <UserLayout activeTab="events">
      <div className="wl-user-teams flex flex-col">
        {canAdd && (
          <div className="flex gap-2 items-center place-self-end mb-10">
            <ButtonIcon
              type="increase"
              onClick={handleAddEvent}
              ariaLabel="Add New Event "
            />
            Add New Event
          </div>
        )}
        {isFetchEventSuccess && userEvents?.data && (
          <EventList
            userId={user}
            handleEditEvent={handleEditEvent}
            userEvents={userEvents?.data}
          />
        )}
      </div>
    </UserLayout>
  )
}

export const getServerSideProps = async ({
  resolvedUrl,
  req,
  res,
  locale,
  defaultLocale,
}: {
  resolvedUrl: string
  res: NextApiResponse
  req: NextApiRequest
  locale: string
  defaultLocale: string
}) => {
  const hasAccess = routeAuthentication({
    resolvedUrl,
    req,
    res,
  })

  if (!hasAccess) {
    return {
      redirect: { destination: locale!=defaultLocale?`/${locale}/login`:'/login', permanent: false },
    }
  }

  const sessionId = getCookie('SESSION', { req, res })
  const user = jwt.decode(`${sessionId}`) as JwtPayload
  const userEvents = await getUserEvents(user?.id, {
    headers: {
      Authorization: sessionId,
    },
  })

  return {
    props: {
      initialUserEvents: userEvents?.data,
      user: user?.id,
      canAdd: false,
      // canAdd:
      // user?.role === SITE_ROLE.ADMIN || user?.role === SITE_ROLE.SUPERADMIN,
      ...(await serverSideTranslations(locale)),
    },
  }
}
