import { useState } from 'react'

import ButtonIcon from '@/atoms/ButtonIcon'
import { cx } from 'class-variance-authority'

interface Props {
  classNames?: string
  error?: string
  value?: number
  handleChange: (number?: any) => any
}

export default function InputNumber({
  classNames,
  error,
  value = 1,
  handleChange,
}: Props) {
  const onDecrease = () => handleChange(value > 1 ? value - 1 : value)
  const onIncrease = () => handleChange(value + 1)

  return (
    <div className="wl-input__container flex justify-between md:gap-[64px]">
      <ButtonIcon type="decrease" onClick={onDecrease} />
      <div className="relative max-w-[50vw] md:w-[374px]">
        <label className="absolute top-3 left-4 text-gray-400">Number:</label>
        <input
          className={cx(
            'wl-input wl-input-number',
            'w-full h-[58px] py-2 pl-[122px] pr-3',
            'bg-gray-200',
            'border border-gray-200 rounded-md shadow-sm focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1',
            'placeholder:font-input placeholder:text-gray-300 text-form-input',
            classNames,
            error ? 'error' : ''
          )}
          type="number"
          min={1}
          value={value}
          onChange={(evt) => handleChange(evt?.target?.value)}
        />
      </div>
      <ButtonIcon type="increase" onClick={onIncrease} />
    </div>
  )
}
