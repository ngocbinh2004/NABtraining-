export function getPage({
  totalResult,
  page,
}: {
  totalResult: number
  page: { current: number; size: number }
}): { start: number; end: number } {
  const onPageOne = page.current === 1
  const previousPage = (page?.current || 1) - 1
  const start = onPageOne ? 0 : previousPage * page?.size
  const onPageLast = page?.size * page?.current >= totalResult
  const end = onPageLast ? totalResult : page?.size * page?.current

  return {
    start,
    end,
  }
}
