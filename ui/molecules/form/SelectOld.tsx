import { cx } from 'class-variance-authority'

import Icon from '@/atoms/Icon'
import Text from '@/atoms/Text'

interface Props {
  name: string
  label?: string
  onChange: (...args: any) => any
  placeholder?: string
  error?: string
  classNames?: string
  selectedOption?: string | number | undefined
  options?: { label: string; value: string | number | undefined }[]
  onFocus?: (...args: any) => any
  onBlur?: (...args: any) => any
  tabIndex?: number
}

export default function Select({
  name,
  label,
  placeholder,
  error,
  classNames,
  selectedOption,
  options,
  onFocus,
  onBlur,
  onChange,
  tabIndex,
}: Props) {
  const selectedLabel =
    selectedOption &&
    !!options?.length &&
    options.find((o) => o.value === selectedOption)?.label
  return (
    <div
      key={name}
      className="wl-input__container w-full lg:max-w-[50vw] md:max-w-[488px] md:w-full flex flex-col"
    >
      {label && (
        <Text
          htmlFor={name}
          size="form-label"
          classNames={label ? '' : 'hidden'}
          component="label"
        >
          {label}
        </Text>
      )}
      <div className="wl-select-selected w-full relative">
        <div
          className={cx(
            'wl-input wl-input-select',
            'w-full rounded',
            'h-20 px-8 py-[27.5px]',
            'text-left',
            'bg-gray-200',
            'border border-gray-200 shadow-sm',
            'focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1',
            'font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold',
            classNames,
            selectedLabel ? 'text-form-input' : 'text-gray-300',
            error ? 'error' : ''
          )}
        >
          {selectedLabel || placeholder}
        </div>
        <select
          name={name}
          id={name}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(e?.target?.value)}
          className="wl-select absolute top-0 w-full h-full opacity-0 z-10"
          tabIndex={tabIndex}
          value={selectedOption || ''}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options &&
            options?.length > 0 &&
            options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
        </select>
        <Icon
          icon="caret"
          width={20}
          height={21}
          classNames="absolute text-gray-900 top-[30px] right-[30px]"
        />
      </div>
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
