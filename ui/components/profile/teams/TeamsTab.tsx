import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

// helpers
import { DELETE } from 'helpers/ssrRequest'
//export { getServerSideProps } from 'helpers/loginGetServerSideProps'
// ui
import Link from '@/atoms/Link'
import Tab from '@/molecules/tab/Tab'
import CardEditTeam from '@/organisms/card/account/EditTeam'
import { ModalOk, ModalConfirmation } from '@/organisms/Modal'
// constants
import { UserTeam } from 'interfaces/user_team_type'
import { ICategory } from 'interfaces/category_type'
import { TEAM_ROLE } from 'constants/role'

const EmptyResult = dynamic(() => import('@/components/EmptyRecord'))

interface Props {
  userId?: number
  categories: ICategory[]
  canDelete?: boolean
  teamPerCategory: (ICategory & { teams: UserTeam[] })[]
  handleEditTeam: (...args: any) => any
  handleEditMember: (...args: any) => any
}

export default function TeamsTab({
  userId,
  teamPerCategory,
  categories,
  canDelete,
  handleEditTeam,
  handleEditMember,
}: Props) {
  // Query
  /* const queryClient = useQueryClient()
   const { mutate: mutateRemoveTeam } = useMutation({
     mutationFn: (deleteTeamId?: number) => {
       return DELETE(`teams?id=${deleteTeamId}`)
     },
     onSuccess: (_response: any) => {
       toast('Team removed!')
       queryClient.invalidateQueries({
         queryKey: ['user-team', `user_id=${userId}`],
       })
       queryClient.invalidateQueries({
         queryKey: ['user', `user_id=${userId}`],
       })
     },
     onError: (error: any) => {
       setShowErrorModal(true)
       setError(`${error?.message || error}`?.substring(0, 100))
     },
     onSettled: () => {
       setShowConfirmModal(false)
     },
   })
 
   // State
   const [showErrorModal, setShowErrorModal] = useState(false)
   const [showConfirmModal, setShowConfirmModal] = useState(false)
   const [error, setError] = useState<string | undefined>()
   const [deleteTeamId, setDeleteTeamId] = useState<number | undefined>()
 
   const [activeCategory, setActiveCategory] = useState<number>(
     categories?.[0]?.id || -1
   )
 
   const currentTeam = teamPerCategory.find(
     (category: ICategory) => category.id === activeCategory
   )
 
   // Function
   const handleCloseErrorModal = () => setShowErrorModal(false)
   const handleCloseConfirmationModal = () => setShowConfirmModal(false)
   const handleDeleteTeam = (teamId: number) => {
     setDeleteTeamId(teamId)
     setShowConfirmModal(true)
   }
 
   useEffect(() => {
     if (categories?.length) {
       setActiveCategory(categories?.[0]?.id)
     }
   }, [categories])
   return (
     <>
       <Tab
         type="button"
         name="wl-user-teams__tab"
         onClick={(id) => setActiveCategory(id)}
         activeTab={activeCategory}
         tabs={categories}
       >
         <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
           {currentTeam &&
             currentTeam?.teams &&
             currentTeam?.teams?.length > 0 ? (
             currentTeam?.teams?.map((userTeam: UserTeam) => (
               <Link
                 href={`/events/teams/${userTeam.team_id}`}
                 key={userTeam.id}
               >
                 <CardEditTeam
                   contents={[
                     { label: 'Team Name', content: userTeam.team?.name },
                     {
                       label: 'Abbreviation',
                       content: userTeam.team?.abbreviation || 'N/A',
                     },
                     {
                       label: 'Group',
                       content: `${userTeam.team?.category?.name || 'N/A'}`,
                     },
                   ]}
                   showEdit={userTeam.role === TEAM_ROLE.TEAM_MANAGER}
                   showDelete={canDelete}
                   handleEditTeam={() => handleEditTeam(userTeam)}
                   handleEditMember={() => handleEditMember(userTeam)}
                   handleDeleteTeam={() => handleDeleteTeam(userTeam?.team_id)}
                 />
               </Link>
             ))
           ) : (
             <div className="mt-12 w-full lg:col-span-3">
               <EmptyResult text="there are no teams" />
             </div>
           )}
         </div>
       </Tab>
       <ModalOk
         showModal={showErrorModal}
         title="Failed to remove team"
         message={error || 'Something gone wrong'}
         labelOk="Retry"
         handleCloseModal={handleCloseErrorModal}
       />
       <ModalConfirmation
         showModal={showConfirmModal}
         title="Are you sure to remove team?"
         message="This action can not be reverted"
         labelCancel="Cancel"
         labelOk="Delete"
         handleOk={() => mutateRemoveTeam(deleteTeamId)}
         handleCloseModal={handleCloseConfirmationModal}
       />
     </>
   )*/
}
