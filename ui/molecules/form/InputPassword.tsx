import { useState } from 'react'
import { cx } from 'class-variance-authority'

import Text from '@/atoms/Text'
import Icon from '@/atoms/Icon'

interface Props {
  name: string
  onChange: (...args: any) => any
  required?: boolean
  placeholder?: string
  classNames?: string
  value?: any | null
  label?: string
  error?: string
  tabIndex?: number
  disabled?: boolean
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
  const [open, setIsOpen] = useState(false)
  const togglePassword = () => setIsOpen((open) => !open)
  return (
    <div
      key={name}
      className="wl-input__container w-full lg:max-w-[50vw] flex flex-col"
    >
      <Text
        htmlFor={name}
        classNames={label ? '' : 'hidden h-0'}
        component="label"
        size="form-label"
      >
        {label}
        {required ? <span className="text-red-500">*</span> : ''}
      </Text>
      <div className="w-full relative">
        <input
          type={open ? 'text' : 'password'}
          onChange={onChange}
          className={cx(
            `wl-input wl-input-password`,
            'w-full rounded',
            'h-[48px] lg:h-[59px] px-8 py-[27.5px]',
            'bg-gray-200',
            'border border-gray-200 shadow-sm',
            'focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1',
            'font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold',
            'placeholder:font-input placeholder:text-input-placeholder--sm placeholder:lg:font-input placeholder:lg:text-input-placeholder  placeholder:text-gray-300 text-form-input',
            classNames,
            error ? 'error' : ''
          )}
          placeholder={placeholder}
          name={name}
          value={value}
          tabIndex={tabIndex}
          disabled={disabled}
        />
        <div
          className={cx('absolute top-5 right-[-30px]', classNames)}
          role="button"
          onClick={togglePassword}
        >
          <Icon
            width={64}
            height={64}
            icon={open ? 'eye-opened' : 'eye-closed'}
            classNames="text-form-input"
          />
        </div>
      </div>
      <Text
        size="form-label-error"
        classNames={cx('wl-input__label-error', error ? '' : 'hidden h-0')}
        component="label"
      >
        {error}
      </Text>
    </div>
  )
}
