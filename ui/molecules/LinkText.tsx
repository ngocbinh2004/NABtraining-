import Link, { Props as LinkProps } from '@/atoms/Link'
import Text, { Props as TextProps } from '@/atoms/Text'

interface LinkTextProps extends LinkProps, TextProps {
  children: React.ReactNode
  linkClassNames?: string
  target?: string
  underlined?: boolean
}

export default function LinkText({
  as,
  children,
  href,
  replace,
  scroll,
  shallow,
  passHref,
  linkClassNames,
  classNames,
  align,
  size,
  target,
  underlined,
  onClick,
}: LinkTextProps) {
  return (
    <Link
      classNames={linkClassNames}
      as={as}
      href={href}
      passHref={passHref}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      target={target}
      onClick={onClick}
    >
      <Text
        align={align}
        classNames={classNames}
        decoration={underlined ? 'underline' : undefined}
        size={size ?? 'body4'}
      >
        {children}
      </Text>
    </Link>
  )
}
