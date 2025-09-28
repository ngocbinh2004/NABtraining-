import { cx } from 'class-variance-authority'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  classNames?: string
}

export default function Line({ orientation = 'horizontal', classNames }: Props) {
  const baseClasses = cx(
    'wl-line',
    orientation === 'horizontal' ? 'bg-gradient-to-r from-black via-white to-black w-full h-px' : 'bg-white h-1/4 w-px',
    classNames
  )
  return <div className={baseClasses} />
}
