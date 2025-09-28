export const splitName = (name: string) => {
  const names = name?.split(' ') || []
  const lastName = names && names.splice(-1, 1)
  const firstName = names.join(' ')
  return [firstName, lastName]
}
