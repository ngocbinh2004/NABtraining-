import { cx } from 'class-variance-authority'
import { useEffect, useRef } from 'react'

import Text from '@/atoms/Text'

interface Props {
  name: string
  placeholder?: string
  classNames?: string
  value?: any
  label?: string
  error?: string
  max?: string
  min?: string
  onFocus?: (...args: any) => any
  onBlur?: (...args: any) => any
  onChange: (...args: any) => any
  required?: boolean
  tabIndex?: number
}

export default function InputDate({
  onChange,
  onFocus,
  onBlur,
  classNames,
  placeholder,
  name,
  value,
  label,
  error,
  max,
  min,
  tabIndex,
  required,
}: Props) {
  const dateRef = useRef<HTMLInputElement>(null)

  const onDateClick = () => {
    dateRef?.current?.showPicker()
  }

  useEffect(() => {
    const element = dateRef.current

    function showDatePicker() {
      try {
        element?.showPicker()
      } catch (err: any) {
        console.log(err)
      }
    }

    element?.addEventListener('focus', showDatePicker)

    return () => element?.removeEventListener('focus', showDatePicker)
  }, [])

  return (
    <div
      key={name}
      className="wl-input__container w-full lg:max-w-[50vw] md:max-w-[488px] md:w-full flex flex-col font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold placeholder:font-input placeholder:text-input-placeholder--sm placeholder:lg:font-input placeholder:lg:text-input-placeholder  placeholder:text-gray-300 text-form-input text-left"
    >
      <div className="flex items-baseline w-full gap-2">
        <Text
          htmlFor={name}
          size="form-label"
          component="label"
          classNames={label ? '' : 'hidden'}
        >
          {label}
          {required ? <span className="text-red-500">*</span> : ''}
        </Text>
      </div>

      <div
        className="wl-date-selected w-full relative"
        role="button"
        onClick={onDateClick}
      >
        <div
          className={cx(
            'wl-input wl-input-date',
            'w-full rounded',
            'h-20 px-8 py-[27.5px]',
            'bg-gray-200',
            'border border-gray-200 shadow-sm',
            'focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1',
            'font-input text-input-placeholder',
            classNames,
            value ? '' : 'text-gray-300',
            error ? 'error' : ''
          )}
        >
          {value || placeholder}
        </div>
        <input
          type="date"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(e?.target?.value)}
          className="wl-select absolute top-0 w-full h-full opacity-0 z-10"
          id={name}
          name={name}
          value={value}
          max={max}
          min={min}
          tabIndex={tabIndex}
          ref={dateRef}
        />
      </div>

      <label
        className={
          error
            ? 'font-input text-input-label-error text-rose-600 mt-2'
            : 'hidden'
        }
      >
        {error}
      </label>
    </div>
  )
}
