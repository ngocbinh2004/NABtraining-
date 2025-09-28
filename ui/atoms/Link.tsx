import NextLink, { LinkProps } from 'next/link'

export interface Props extends LinkProps {
  children: React.ReactNode
  classNames?: string
  target?: string
  label?: string
}

export default function Link({
  as,
  label,
  children,
  href,
  target,
  replace,
  scroll,
  shallow,
  passHref,
  classNames,
  onClick,
}: Props) {
  return (
    <NextLink
      aria-label={label}
      as={as}
      href={href}
      passHref={passHref}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      className={classNames}
      onClick={onClick}
      target={target}
    >
      {children}
    </NextLink>
  )
}
