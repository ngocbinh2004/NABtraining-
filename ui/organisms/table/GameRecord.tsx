import { cx } from 'class-variance-authority'
// helpers
import { splitName } from 'helpers/splitName'
// ui
import Text from '@/atoms/Text'
import Table from '@/organisms/table/Table'
// constants
import { ISetRecord } from 'interfaces/set_type'

interface Props {
  records?: ISetRecord[]
  page?: {
    size: number
    current: number
    onChange: (...args: any) => any
  }
}

const TABLE_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
    render: (record: ISetRecord) => {
      const [firstName, lastName] = splitName(
        record?.user_team?.user?.name || ''
      )
      return (
        <td key={`name-${record.id}`}>
          <div className="flex flex-col">
            {lastName && (
              <Text size="h3" classNames="font-medium">
                {firstName}
              </Text>
            )}
            <Text size="h2" classNames="font-medium">
              {`${lastName || firstName}`}
            </Text>
          </div>
        </td>
      )
    },
  },
  {
    key: 'player_no',
    label: 'No.',
    render: (record: ISetRecord) => {
      return (
        <td key={`player_no-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.user_team?.player_no || 'N/A'}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'position',
    label: 'Position',
    render: (record: ISetRecord) => {
      return (
        <td key={`position-${record.id}`}>
          <Text
            size="body5"
            classNames={cx(
              'font-medium',
              record?.user_team?.position ? 'capitalize' : ''
            )}
          >
            {record?.user_team?.position?.toLowerCase()?.replace('_', ' ') ||
              'N/A'}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'games',
    label: 'Games',
    render: (record: ISetRecord) => {
      return (
        <td key={`games-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.games}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'board',
    label: 'Board',
    render: (record: ISetRecord) => {
      return (
        <td key={`board-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.board}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'attack_score',
    label: 'Attack score',
    render: (record: ISetRecord) => {
      return (
        <td key={`attack_score-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.attack_score}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'block_score',
    label: 'Block score',
    render: (record: ISetRecord) => {
      return (
        <td key={`block_score-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.block_score}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'serve_score',
    label: 'Serve score',
    render: (record: ISetRecord) => {
      return (
        <td key={`serve_score-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.serve_score}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'total',
    label: 'Total',
    render: (record: ISetRecord) => {
      return (
        <td key={`total-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.total}
          </Text>
        </td>
      )
    },
  },
  {
    key: 'average',
    label: 'Average',
    render: (record: ISetRecord) => {
      return (
        <td key={`average-${record.id}`}>
          <Text size="body5" classNames="font-medium">
            {record?.average}
          </Text>
        </td>
      )
    },
  },
]
export default function GameRecord({ records, page }: Props) {
  return (
    <div className="wl-table-game-record w-full mt-[72px] mb-10 px-[30px] lg:px-0">
      <Table
        columns={TABLE_COLUMNS}
        records={records}
        columnSize={10}
        page={page}
      />
    </div>
  )
}
