// ui
import Text from '@/atoms/Text'

interface Props {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  subtitle2?: string
  subtitle3?: string
}

export default function UserGameLayout({
  title,
  subtitle,
  subtitle2,
  subtitle3,
  children,
}: Props) {
  return (
    <div
      className="wl-user-game container mx-auto mt-[47px] flex flex-col item-start gap-2"
      key={title}
    >
      <Text size="h1">{title}</Text>
      {subtitle && <Text size="h2">{subtitle}</Text>}
      {subtitle2 && <Text size="h3">{subtitle2}</Text>}
      {subtitle3 && <Text size="h3">{subtitle3}</Text>}

      <div className="mt-20">{children}</div>
    </div>
  )
}
