import Text from '@/atoms/Text'

interface IProps {
  value?: number
  label?: string
  name?: string
  min?: number
  max?: number
  handleChange: (...args: any) => any
}

export default function InputRange({
  value = 0,
  label,
  name,
  min = 0,
  max = 100,
  handleChange,
}: IProps) {
  return (
    <>
      <Text
        htmlFor={name}
        classNames={label ? '' : 'hidden'}
        component="label"
        size="form-label"
      >
        {label}
      </Text>
      <input
        id="minmax-range"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => handleChange(e?.target?.value)}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </>
  )
}
