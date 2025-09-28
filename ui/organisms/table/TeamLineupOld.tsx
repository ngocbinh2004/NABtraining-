import { useState } from 'react'
// ui
import Image from '@/molecules/media/Image'
import Search from '@/molecules/Search'
import Table from '@/organisms/table/Table'
// constants
import { UserTeam } from 'interfaces/user_team_type'
import { TEAM_ROLE } from 'constants/role'

interface Props {
  lineup?: UserTeam[]
}

const TABLE_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
    span: 2,
    render: (member: UserTeam) => {
      return (
        <>
          <td className="w-[49px] h-[49px]">
            {member.user?.profile_picture && (
              <Image
                classNames="mr-4"
                width={49}
                height={49}
                alt={member.user?.name}
                url={member.user?.profile_picture}
                isCircle
              />
            )}
          </td>
          <td className="text-left">{member.user?.name}</td>
        </>
      )
    },
  },
  {
    key: 'player_no',
    label: 'No.',
  },
  {
    key: 'position',
    label: 'Position',
  },
  {
    key: 'weight_kg',
    label: 'Weight(kg)',
    render: ({ user }: UserTeam) => <td>{user?.weight_kg ?? 'N/A'} </td>,
  },
  {
    key: 'height_cm',
    label: 'Height(cm)',
    render: ({ user }: UserTeam) => <td>{user?.height_cm ?? 'N/A'}</td>,
  },
  {
    key: 'spike',
    label: 'Spike',
  },
  {
    key: 'block',
    label: '2 Hands Block',
  },
]
export default function TeamLineup({ lineup }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const filteredLineup =
    lineup && lineup?.length > 0 && searchQuery?.length > 0
      ? lineup
          ?.filter(
            (member) =>
              member.user.name.toLowerCase().includes(searchQuery) &&
              member?.user?.role !== TEAM_ROLE.PLAYER
          )
          ?.filter((member) => !!member)
      : lineup ?? []

  return (
    <div className="table-team-line-up flex flex-col items-center mt-8">
      <div className="lg:w-[70%]">
        <Search
          placeholder="Please enter player name"
          onClick={setSearchQuery}
        />
      </div>
      <Table columns={TABLE_COLUMNS} records={filteredLineup} columnSize={8} />
    </div>
  )
}
