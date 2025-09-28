import { cx } from 'class-variance-authority'
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'

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
  options?: { label: string; value: string | number | undefined }[] | []
  tabIndex?: number
  required?: boolean
  compact?: boolean
}

export default function Select({
  name,
  label,
  placeholder,
  error,
  classNames,
  selectedOption,
  options,
  onChange,
  required,
  tabIndex,
  compact,
}: Props) {
  const selectedLabel =
    selectedOption &&
    !!options?.length &&
    options.find((o) => o.value === selectedOption)?.label
  return (
    <div
      key={name}
      className="wl-input__container w-full flex flex-col focus:outline-none"
      tabIndex={tabIndex}
    >
      <Listbox value={selectedLabel} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-body-5 font-secondary font-input--sm text-input-label--sm lg:font-input lg:text-input-label">
              {label}
              {required ? <span className="text-red-500">*</span> : ''}
            </Listbox.Label>
            <div className="relative">
              <Listbox.Button
                className={cx(
                  'wl-input wl-input-select',
                  'border border-gray-200 shadow-sm',
                  'relative w-full cursor-default bg-gray-200 text-left text-form-input shadow-sm ring-inset focus:outline-none focus:ring-2 focus:ring-blue-300 sm:text-sm sm:leading-6',
                  'h-[48px] py-3 px-2 md:px-4 md:py-2',
                  'overflow-hidden',
                  classNames,
                  error ? 'error' : ''
                )}
              >
                <span
                  className={cx(
                    compact ? 'max-w-[60px] sm:w-full': 'w-full',
                    'focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1',
                    'font-input text-semibold',
                    selectedLabel ? 'text-form-input' : 'text-gray-300',
                    'block truncate overflow-hidden'
                  )}
                >
                  {selectedLabel || placeholder}
                </span>

                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Icon
                    icon="caret"
                    width={20}
                    height={21}
                    classNames={cx(
                      'absolute text-[#004F36] top-[15px] right-[16px]',
                      open ? 'transition ease-in duration-100 rotate-180' : ''
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-[9999] mt-1 min-h-full max-h-[300px] w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options &&
                    options?.length > 0 &&
                    options.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          cx(
                            active
                              ? 'bg-blue-300 text-white'
                              : 'text-form-input',
                            'relative cursor-default select-none px-8 py-2',
                            'font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold'
                          )
                        }
                        value={option.value}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={cx(
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate'
                              )}
                            >
                              {option.label}
                            </span>

                            {selected ? (
                              <span
                                className={cx(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              ></span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Transition>
            </div>
            <Text
              size="form-label-error"
              component="label"
              classNames={cx('wl-input__label-error', error ? '' : 'hidden')}
            >
              {error}
            </Text>
          </>
        )}
      </Listbox>
    </div>
  )
}
