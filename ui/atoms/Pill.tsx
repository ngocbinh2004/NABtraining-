import { cx } from 'class-variance-authority'

interface Props {
  classNames?: string
  children: React.ReactNode
  isEvent?: boolean
}

export default function Pill({ isEvent, children, classNames }: Props) {
  return (
    <span
      className={cx(
        isEvent ? '' : 'bg-[#ff5900] text-white',
        'px-2 py-px',
        classNames
      )}
    >
      {children}
    </span>
  )
}

const COLOR: {
  [key: string]: any
} = {
  OPEN: 'bg-green-300 text-green',
  ON_GOING: 'bg-blue-300 text-green',
  COMPLETED: 'bg-gray-300 text-green',
  CANCELED: 'bg-red-300 text-green',
  DRAFT: 'bg-white text-black',
}

export function EventPill({ status }: { status: string }) {
  return (
    <Pill isEvent classNames={COLOR[status] || ''}>
      {`${status}`.replace('_', '')}
    </Pill>
  )
}
