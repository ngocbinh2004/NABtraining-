interface Props {
  text: string
}

export default function Tooltip({ text }: Props) {
  return (
    <div className="tooltip relative ml-1 z-[999]" data-text={text}>
      <svg
        width={13}
        height={13}
        id="hoverable-info"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6.5" cy="6.5" r="6.5" fill="url(#paint0_linear_28_11717)" />
        <path
          d="M5.763 2.146L6.038 7.745H6.973L7.248 2.146H5.763ZM6.5 8.339C6.258 8.339 6.06 8.416 5.906 8.57C5.73 8.724 5.653 8.922 5.653 9.164C5.653 9.406 5.73 9.604 5.906 9.758C6.06 9.912 6.258 10 6.5 10C6.742 10 6.94 9.923 7.116 9.769C7.27 9.615 7.358 9.406 7.358 9.164C7.358 8.922 7.27 8.724 7.116 8.57C6.951 8.416 6.742 8.339 6.5 8.339Z"
          fill="#494949"
        />
        <defs>
          <linearGradient
            id="paint0_linear_28_11717"
            x1="6.5"
            y1="5.69038e-07"
            x2="16.38"
            y2="14.04"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#FFFFF0" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
