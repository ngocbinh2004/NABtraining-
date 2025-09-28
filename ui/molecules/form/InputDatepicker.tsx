import { cx } from 'class-variance-authority'
import DatePicker from 'react-datepicker'

import Text from '@/atoms/Text'
import Tooltip from '@/atoms/Tooltip'

interface Props {
  date?: Date | undefined
  dateFormat?: string
  endDate?: Date
  error?: string
  minDate?: Date
  name: string
  label?: string
  hoverableText?: string
  placeholder?: string
  selectsStart?: boolean
  selectsEnd?: boolean
  startDate?: Date
  showTimeSelect?: boolean
  tabIndex?: number
  required?: boolean
  onChange: (d: any) => void
}

export default function InputDatepicker({
  date,
  dateFormat = 'yyyy-MM-dd',
  endDate,
  error,
  label,
  hoverableText,
  minDate,
  name,
  placeholder,
  selectsStart,
  selectsEnd,
  startDate,
  showTimeSelect,
  tabIndex,
  onChange,
  required,
}: Props) {
  return (
    <div
      key={name}
      className="wl-input__container w-full lg:max-w-[50vw] md:max-w-[488px] md:w-full flex flex-col font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold placeholder:font-input placeholder:text-input-placeholder--sm placeholder:lg:font-input placeholder:lg:text-input-placeholder  placeholder:text-gray-300 text-form-input"
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
        {hoverableText && <Tooltip text={hoverableText} />}
      </div>
      <DatePicker
        className={error ? 'wl-input wl-input-date error' : ''}
        dateFormat={dateFormat}
        endDate={endDate}
        startDate={startDate}
        onChange={(d: any) => onChange(d)}
        minDate={minDate}
        selected={date}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        showTimeSelect={showTimeSelect}
        placeholderText={placeholder}
        tabIndex={tabIndex}
        closeOnScroll
      />
      <Text
        size="form-label-error"
        component="label"
        classNames={cx('wl-input__label-error', error ? '' : 'hidden')}
      >
        {error}
      </Text>
    </div>
  )
}

export function InputDateRangePicker({
  startDate,
  endDate,
}: {
  startDate: Props
  endDate: Props
}) {
  return (
    <>
      <InputDatepicker
        date={startDate.date}
        dateFormat={startDate.dateFormat}
        endDate={endDate.date}
        error={startDate.error}
        label={startDate.label}
        name={startDate.name}
        tabIndex={startDate.tabIndex}
        onChange={startDate.onChange}
        placeholder={startDate.placeholder}
        required={startDate.required}
        selectsStart
        hoverableText={startDate.hoverableText}
        showTimeSelect={startDate.showTimeSelect}
      />
      <InputDatepicker
        date={endDate.date}
        dateFormat={endDate.dateFormat}
        endDate={endDate.date}
        error={endDate.error}
        label={endDate.label}
        minDate={startDate.date}
        name={endDate.name}
        tabIndex={endDate.tabIndex}
        onChange={endDate.onChange}
        placeholder={endDate.placeholder}
        selectsEnd
        startDate={startDate.date}
        hoverableText={endDate.hoverableText}
        showTimeSelect={endDate.showTimeSelect}
        required={endDate.required}
      />
    </>
  )
}
