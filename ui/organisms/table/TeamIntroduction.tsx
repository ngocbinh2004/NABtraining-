import Text from '@/atoms/Text'
import Line from '@/atoms/Line'

interface Props {
  introduction: {
    abbreviation?: string
    name?: string
    established?: string
    description?: string
  }
}

export default function TeamIntroduction({
  introduction: { name, abbreviation, established, description },
}: Props) {
  return (
    <div className="w-full mb-10 mt-[56px] lg:px-0">
      <div className="w-full flex flex-col text-left">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-[30%]">
            <Text size="body5">Name</Text>
          </div>
          <div className="w-full lg:w-[70%] lg:pl-4">
            <Text size="body5" fontWeight="semibold">
              {name}
            </Text>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <Line classNames="my-6" />
        </div>
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-[30%]">
            <Text size="body5">Abbreviation</Text>
          </div>
          <div className="w-full lg:w-[70%] lg:pl-4">
            <Text size="body5" fontWeight="semibold">
              {abbreviation}
            </Text>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <Line classNames="my-6" />
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[30%]">
            <Text size="body5">Established</Text>
          </div>
          <div className="w-full lg:w-[70%] lg:pl-4">
            <Text size="body5" fontWeight="semibold">
              {`${established}`}
            </Text>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <Line classNames="my-6" />
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[30%]">
            <Text size="body5">Description</Text>
          </div>
          <div className="w-full lg:w-[70%] lg:pl-4">
            <Text size="body5" fontWeight="semibold">
              {description}
            </Text>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <Line classNames="my-6" />
        </div>
      </div>
    </div>
  )
}
