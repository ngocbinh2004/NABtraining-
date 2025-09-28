import { Fragment } from 'react'
import { cx } from 'class-variance-authority'

// helpers
import { getPage } from 'helpers/getPage'

// ui
import Line from '@/atoms/Line'
import EmptyResult from '@/components/EmptyRecord'
import Pagination from '@/molecules/Pagination'

type TPage = {
  size: number
  current: number
  onChange: (page: number) => any
}

interface Props {
  columns?: {
    [key: string]: any
    key: string
    className?: string
    label: string
    span?: number
    render?: (...args: any) => any
  }[]
  columnSize?: number
  // data from API
  records?: {
    id?: any
    [key: string]: any
  }[]
  emptyLabel?: string
  page?: TPage
}
export default function Table({
  columns,
  records,
  emptyLabel,
  columnSize = 1,
  page,
}: Props) {
  const hasColumns = columns && columns?.length > 0
  const { start = 0, end = records?.length } =
    records && records?.length > 0 && !!page
      ? getPage({ totalResult: records?.length, page })
      : {}
  const shownRecords = records?.slice(start, end)

  return (
    <div className="wl-table__container flex flex-col gap-4">
      <div className="wl-table__wrapper w-full mt-8 px-2 md:px-[56px] lg:px-0 overflow-x-auto">
        <table className="wl-table w-full table-auto">
          <thead className="w-[100%]">
            <tr className="w-full">
              {hasColumns &&
                columns?.map(({ key, span, label, className }) => (
                  <th
                    key={`th-${key}`}
                    colSpan={span}
                    className={cx('px-4', className)}
                  >
                    {label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            <TableLine columnSize={columnSize} />
            {shownRecords && shownRecords?.length > 0 ? (
              shownRecords.map((record) => (
                <Fragment key={record.id}>
                  <tr>
                    {hasColumns &&
                      columns.map(({ render, span = 1, key }) => {
                        if (render) return render(record)
                        return (
                          <td
                            key={`${key}-${record.id}`}
                            colSpan={span}
                            className="px-4"
                          >
                            {record?.[key] ?? 'N/A'}
                          </td>
                        )
                      })}
                  </tr>
                  <TableLine columnSize={columnSize} />
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columnSize}>
                  <EmptyResult text={emptyLabel} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {page && (
        <Pagination
          size={page.size}
          totalResult={records?.length || 0}
          page={page?.current}
          handleChange={page.onChange}
        />
      )}
    </div>
  )
}

function TableLine({ columnSize }: { columnSize: number }) {
  return (
    <tr>
      <td colSpan={columnSize}>
        <Line classNames="my-6" />
      </td>
    </tr>
  )
}
