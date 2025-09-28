import { cx } from 'class-variance-authority'
//UI
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

interface YearPickerProps {
  currentYear: number
  minYear: number
  maxYear: number
  handleYearChange: (type: string) => void
  disabled?: boolean
}

export default function YearPicker({
  currentYear,
  minYear,
  maxYear,
  handleYearChange,
  disabled = false,
}: YearPickerProps) {
  const isPrevDisabled = disabled || currentYear === minYear
  const isNextDisabled = disabled || currentYear === maxYear

  return (
    <div
      className={cx(
        'w-full mt-6 flex justify-end items-center',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <p className="text-white mr-4">{`${currentYear} - ${(currentYear + 1)
        .toString()
        .slice(2, 4)}`}</p>
      <div className="flex justify-center items-center gap-4">
        <button
          disabled={isPrevDisabled}
          className={cx(
            'w-10 h-10 flex justify-center items-center',
            isPrevDisabled ? 'bg-[#D9D9D9] cursor-not-allowed' : 'bg-[#009919]'
          )}
          onClick={() => !isPrevDisabled && handleYearChange('prev')}
        >
          <IoChevronBack
            className={cx('w-5 h-5', isPrevDisabled ? 'text-gray-500' : 'text-white')}
          />
        </button>
        <button
          disabled={isNextDisabled}
          className={cx(
            'w-10 h-10 flex justify-center items-center',
            isNextDisabled ? 'bg-[#D9D9D9] cursor-not-allowed' : 'bg-[#009919]'
          )}
          onClick={() => !isNextDisabled && handleYearChange('next')}
        >
          <IoChevronForward
            className={cx('w-5 h-5', isNextDisabled ? 'text-gray-500' : 'text-white')}
          />
        </button>
      </div>
    </div>
  )
}