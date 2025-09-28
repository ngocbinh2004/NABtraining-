interface Props {
  name?: string
  label?: string
  checked?: boolean
  onChange: (...args: any) => any
  value?: string | number
}

export default function Checkbox({
  name,
  label,
  value,
  checked,
  onChange,
}: Props) {
  return (
    <label className="font-input text-input-placeholder--sm lg:text-input-placeholder text-semibold cursor-pointer">
      <input
        name={name}
        id="default-checkbox"
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        className="mr-2 w-5 h-5 bg-gray-200 border border-gray-200 shadow-sm focus:outline-none focus:blue-300 focus:ring-blue-300 focus:ring-1 "
      />
      {label}
    </label>
  )
}
