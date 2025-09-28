interface IProps {
  abbreviation?: string
  name?: string
}

export const getTeamName = ({ abbreviation, name }: IProps = {}): string => {
  if (name && name?.length <= 10) return name
  if (abbreviation) return abbreviation
  return name ?? ''
}
