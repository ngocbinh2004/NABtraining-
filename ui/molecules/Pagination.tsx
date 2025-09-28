import { cx } from 'class-variance-authority'
import Icon from '@/atoms/Icon'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

interface Props {
  isMobile?: boolean
  size: number
  page?: number
  addHref?: false
  totalResult: number
  handleChange: (...args: any) => any
}

export default function Pagination({
  isMobile,
  size,
  page = 1,
  totalResult,
  addHref,
  handleChange,
}: Props) {
  const totalPage = Math.ceil(totalResult / size)

  const onPageLast = size * page >= totalResult

  const pages = getPages({ totalPage, page })

  const Wrapper = ({ href, page, onClick, ...props }: any) =>
    addHref ? (
      <a href={href} {...props} aria-label={`go to page ${page}`} />
    ) : (
      <span
        onClick={onClick}
        {...props}
        role="button"
        aria-label={`go to page ${page}`}
      />
    )
  return (
    <div className="wl-pagination flex flex-col items-center justify-between px-0 md:px-4">
      <div className="mb-3 lg:mb-3.5">
        <Icon
          icon="logo-tpvl-small"
          height={isMobile ? 21 : 40}
          width={isMobile ? 63 : 115}
        />
      </div>
      {/* START: desktop pagination */}
      <div className="md:flex md:flex-1 md:items-center md:justify-between mt-3 lg:mt-4.5">
        {/* START: navigation */}
        <div className="wl-pagination__navigate">
          <nav
            className="isolate inline-flex -space-x-px"
            aria-label="Pagination"
          >
            {/* START: button previous */}
            <Wrapper
              page={pages.prev}
              href={`#${pages.prev}`}
              onClick={() => handleChange(pages.prev)}
              disabled={page === 1}
              className={cx(
                'wl-pagination__navigate__previous',
                'relative inline-flex items-center px-2 py-2 mx-1',
                'hover:text-white hover:bg-linear-active-pagination focus:z-20 focus:outline-offset-0',
                page === 1
                  ? 'opacity-50 pointer-events-none text-[#979797]'
                  : 'text-white'
              )}
            >
              <FaAngleLeft size={isMobile ? 18 : 24} />
            </Wrapper>
            {/* END: button previous */}
            {pages.page > 0 &&
              pages.items.map((p: number | string, idx) => {
                if (p === '…') {
                  return (
                    <span
                      key={`${p}-${idx}`}
                      className="wl-pagination__navigate__ellipsis relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#B4B4B4]"
                    >
                      ...
                    </span>
                  )
                }
                return (
                  <Wrapper
                    key={p}
                    page={p}
                    href={`#${p}`}
                    aria-current="page"
                    className={cx(
                      'relative inline-flex items-center px-2 py-2',
                      'text-base lg:text-lg font-medium text-[#525252]',
                      'focus:z-20 focus-visible:outline',
                      p === page
                        ? 'bg-[#009919] text-white'
                        : 'hover:bg-linear-active-pagination hover:text-white'
                    )}
                    onClick={() => handleChange(p)}
                  >
                    {p}
                  </Wrapper>
                )
              })}
            {/* START: button next */}
            <Wrapper
              page={pages.next}
              href={`#${pages.next}`}
              onClick={() => handleChange(pages.next)}
              disabled={page === totalPage}
              className={cx(
                'wl-pagination__navigate_next',
                'relative inline-flex items-center px-2 py-2 mx-1', // Adds 10px space
                'hover:text-white hover:bg-linear-active-pagination focus:z-20 focus:outline-offset-0',
                page === totalPage
                  ? 'opacity-50 pointer-events-none text-[#979797]'
                  : 'text-white'
              )}
            >
              <FaAngleRight size={isMobile ? 18 : 24} />
            </Wrapper>
            {/* END: button next */}
          </nav>
        </div>
        {/* END: navigation */}
      </div>
      {/* END: desktop pagination */}
    </div>
  )
}

function getPages({
  totalPage,
  page = 1,
}: {
  totalPage: number
  page: number
}) {
  const prev = page === 1 ? null : page - 1
  const next = page === totalPage ? null : page + 1
  const items: (number | string)[] = [1]

  if (page === 1 && totalPage === 1) return { page, prev, next, items }
  if (page > 4) items.push('…')

  const r = 2,
    r1 = page - r,
    r2 = page + r

  for (let i = r1 > 2 ? r1 : 2; i <= Math.min(totalPage, r2); i++) items.push(i)

  if (r2 + 1 < totalPage) items.push('…')
  if (r2 < totalPage) items.push(totalPage)

  return { page, prev, next, items }
}
