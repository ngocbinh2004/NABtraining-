import { cx } from 'class-variance-authority'

import Text from '@/atoms/Text'

interface Props {
  name: string
  onChange: (...args: any) => any
  placeholder?: string
  classNames?: string
  value?: any
  label?: string
  error?: string
  tabIndex?: number
  disabled?: boolean
  required?: boolean
}

export default function Input({
  onChange,
  classNames,
  placeholder,
  name,
  value,
  label,
  error,
  tabIndex,
  disabled,
  required,
}: Props) {
  return (
    <div
      key={name}
      className="wl-input__container w-full md:w-full flex flex-col"
    >
      <Text
        htmlFor={name}
        classNames={label ? '' : 'hidden'}
        component="label"
        size="form-label"
      >
        {label}
        {required ? <span className="text-red-500">*</span> : ''}
      </Text>
      <textarea
        onChange={onChange}
        className={cx(
          'wl-input wl-input-textarea',
          'rounded',
          'px-8 py-[27.5px]',
          'bg-gray-200',
          'border border-gray-200 shadow-sm',
          'focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1',
          'font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold',
          'placeholder:font-input placeholder:text-input-placeholder--sm placeholder:lg:font-input placeholder:lg:text-input-placeholder  placeholder:text-gray-300 text-form-input',
          classNames,
          error ? 'error' : ''
        )}
        rows={4}
        placeholder={placeholder}
        name={name}
        value={value}
        tabIndex={tabIndex}
        disabled={disabled}
      />
      <Text
        size="form-label-error"
        classNames={cx('wl-input__label-error', error ? '' : 'hidden')}
        component="label"
      >
        {error}
      </Text>
    </div>
  )
}
