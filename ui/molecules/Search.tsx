import { useState } from 'react'

import { cx } from 'class-variance-authority'

interface Props {
  placeholder: string
  onClick: (...args: any) => any
}

export default function Search({ placeholder, onClick }: Props) {
  const [search, setSearch] = useState()
  const onChange = (e: any) => setSearch(e?.target?.value)
  const onSearch = () => onClick((search || '').toLowerCase())
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="wl-search__container w-full relative">
      <input
        className={cx(
          'wl-search rounded w-full',
          'h-16 pl-4 pr-[80px]',
          'bg-white',
          'placeholder:font-input--sm placeholder:text-input-placeholder--sm placeholder:lg:font-input placeholder:lg:text-input-placeholder  placeholder:text-gray-300 text-form-input',
          'border border-gray-200 shadow-sm',
          'font-input--sm lg:font-input text-input-placeholder--sm lg:text-input-placeholder',
          'focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1'
        )}
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className={cx(
          'wl-search__submit rounded-r-4',
          'absolute right-0 top-0 h-16 w-16',
          'flex justify-center items-center',
          'focus:outline-1 focus:outline-blue-300'
        )}
        onClick={onSearch}
      >
        {/* Fill linear gradient can not be used on icon component, that's why we import in directly on this f ile*/}
        {/* START: search */}
        <svg
          id="search"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.9998 26.5898L20.4498 18.9998C24.1991 14.476 23.7313 7.80419 19.3873 3.84789C15.0433 -0.108423 8.35698 0.0476389 4.20231 4.20231C0.0476389 8.35698 -0.108423 15.0433 3.84789 19.3873C7.80419 23.7313 14.476 24.1991 18.9998 20.4498L26.5898 27.9998L27.9998 26.5898ZM2.9998 11.9998C2.9998 7.02924 7.02924 2.9998 11.9998 2.9998C16.9704 2.9998 20.9998 7.02924 20.9998 11.9998C20.9998 16.9704 16.9704 20.9998 11.9998 20.9998C7.02924 20.9998 2.9998 16.9704 2.9998 11.9998Z"
            fill="url(#paint0_linear_112_3468)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_112_3468"
              x1="14.4901"
              y1="0.980469"
              x2="14.4901"
              y2="27.9998"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#444444" />
              <stop offset="1" stopColor="#181818" />
            </linearGradient>
          </defs>
        </svg>
        {/* END: search */}
      </button>
    </div>
  )
}
