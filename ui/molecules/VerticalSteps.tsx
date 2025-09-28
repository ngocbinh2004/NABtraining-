import Text from '../atoms/Text'

interface Props {
  steps: string[]
}

export default function VerticalSteps({ steps }: Props) {
  const stepLastIndex = steps?.length - 1
  return (
    <ul className="wl-vertical-steps flex flex-col gap-2 lg:gap-3">
      {steps?.length > 0 &&
        steps.map((step, idx) => (
          <li className="wl-vertical-step relative" key={step}>
            <div className="flex gap-[30px] items-center">
              <Text
                size="list-item"
                classNames={
                  'rounded-full bg-emerald-900 w-[25px] h-[25px] text-center text-white min-w-[25px]'
                }
              >
                {idx + 1}

              </Text>
              <Text size="list-item-text" classNames="text-black">
                {step}
              </Text>
            </div>
            {idx < stepLastIndex && (
              <div className="absolute bottom-[-25px] left-[12px] w-[2px] rounded-[10px] bg-emerald-900 h-[30px]"></div>
            )}
          </li>
        ))}
    </ul>
  )
}
