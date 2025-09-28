import { getCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { useState } from 'react'
// hooks
import { useUserTeam } from 'hooks/useUserTeam'

// helpers
import { routeAuthentication } from 'helpers/routeAuthentication'
import { getCategories, getUserTeam } from 'helpers/api'

// context
import { useModalDispatch } from 'context/modalContext'
// ui
import ButtonIcon from '@/atoms/ButtonIcon'
import TeamsTab from '@/components/profile/teams/TeamsTab'
import UserLayout from '@/layout/UserLayout'
// constants
import { UserTeam } from 'interfaces/user_team_type'
import { ICategory } from 'interfaces/category_type'
import { SITE_ROLE } from 'constants/role'
import { TModalAction, modalName } from 'constants/modal'
import { ModalWrapper } from '@/organisms/Modal'
import CardWrapper from '@/organisms/card/Wrapper'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))
const TeamProfileForm = dynamic(
  () => import('@/components/profile/teams/TeamProfileForm')
)

interface IProps {
  initialUserTeams?: {
    data?: UserTeam[]
  }
  categories?: ICategory[]
  user: number
  canAdd?: boolean
  canDelete?: boolean
  canUpdateTeamRole?: boolean
}

export default function UserTeams({
  categories,
  initialUserTeams,
  user,
  canAdd,
  canDelete,
  canUpdateTeamRole,
}: IProps) {
  // State
  /* const [showFormTeamProfile, setShowFormTeamProfile] = useState(false)
   const [activeUserTeam, setActiveUserTeam] = useState<any>({})
   // Context
   const dispatch = useModalDispatch()
 
   // Query
   const { data: userTeams } = useUserTeam(
     `user_id=${user}`,
     !!user,
     initialUserTeams
   )
 
   // Function
   const handleAddTeam = () => {
     setShowFormTeamProfile(true)
   }
   const handleCloseTeamForm = () => {
     setShowFormTeamProfile(false)
     setActiveUserTeam({})
   }
 
   // Var
   const hasData =
     categories &&
     categories?.length > 0 &&
     userTeams?.data &&
     userTeams?.data?.length > 0
   let teamPerCategory
   if (hasData) {
     teamPerCategory = categories.map((category: ICategory) => {
       const teams = userTeams.data.filter(
         (userTeam: UserTeam) => userTeam?.team?.category_id === category?.id
       )
       return {
         ...category,
         teams,
       }
     })
   }
 
   return (
     <UserLayout activeTab="teams">
       {canAdd && (
         <div className="w-full flex items-center justify-end mb-10">
           <ButtonIcon
             type="increase"
             onClick={handleAddTeam}
             ariaLabel="Add New Team"
           />
           Add New Team
         </div>
       )}
 
       <div className="wl-user-teams lg:container lg:mx-auto mt-[56px]">
         {categories && teamPerCategory && (
           <TeamsTab
             userId={user}
             teamPerCategory={teamPerCategory}
             categories={categories}
             canDelete={canDelete}
             handleEditTeam={(userTeam: UserTeam) => {
               setShowFormTeamProfile(true)
               setActiveUserTeam({
                 ...userTeam?.team,
                 categoryId: userTeam?.team?.category_id,
                 established: userTeam?.team?.established ?? undefined,
               })
             }}
             handleEditMember={(userTeam) => {
               dispatch({
                 type: TModalAction.PUSH,
                 name: modalName.EDIT_MEMBER,
                 data: { teamId: userTeam?.team_id, canUpdateTeamRole },
               })
             }}
           />
         )}
         {!hasData && (
           <div className="mt-24 w-full">
             <EmptyResult text="you have no team" />
           </div>
         )}
       </div>
       <ModalWrapper
         showModal={showFormTeamProfile}
         handlePopModal={handleCloseTeamForm}
       >
         <CardWrapper classNames="p-5 lg:py-20 lg:px-[75px] max-h-[90vh] lg:max-h-[80vh] overflow-x-auto">
           <TeamProfileForm
             formData={activeUserTeam}
             handleBack={handleCloseTeamForm}
             user={user}
           />
         </CardWrapper>
       </ModalWrapper>
     </UserLayout>
   )*/
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
      redirect: { destination: locale != defaultLocale ? `/${locale}/login` : '/login', permanent: false },
    }
  }

  const sessionId = getCookie('SESSION', { req, res })
  const user = jwt.decode(`${sessionId}`) as JwtPayload
  const userTeams = await getUserTeam(`?user_id=${user?.id}`, {
    headers: {
      Authorization: sessionId,
    },
  })

  const categories = await getCategories()
  const sortedCategories = categories?.data?.data?.sort(
    (a: ICategory, b: ICategory) => a.id - b.id
  )

  const isAdmin =
    user?.role === SITE_ROLE.ADMIN || user?.role === SITE_ROLE.SUPERADMIN

  return {
    props: {
      initialUserTeams: userTeams?.data,
      categories: sortedCategories,
      user: user?.id,
      canAdd: true,
      // canAdd: isAdmin,
      canDelete: isAdmin,
      canUpdateTeamRole: isAdmin,
      ...(await serverSideTranslations(locale)),
    },
  }
}
