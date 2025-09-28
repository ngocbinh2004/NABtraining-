import { useState } from 'react'
// ui
import Line from '@/atoms/Line'
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import InputFileImage from '@/molecules/form/InputFileImage'
import Input from '@/molecules/form/Input'
import CardWrapper from '@/organisms/card/Wrapper'

type TFormData = {
  name?: string
  logo?: string
  [key: string]: any
}
interface Props {
  formData?: TFormData
  handleBack: (...data: any) => any
  handleNext: (...data: any) => any
}

export default function SecondStep({
  formData = {},
  handleBack,
  handleNext,
}: Props) {
  // State
  const [form, setForm] = useState({
    logo: formData?.logo,
    name: formData?.name,
  })

  // Function
  const handleChangeInput = ({
    name,
    value,
  }: {
    name: string
    value?: string | number
  }) => {
    setForm((form) => ({
      ...form,
      [name]: value,
    }))
  }

  return (
    <div className="wl-register-user-team__step-2 container mx-auto">
      <CardWrapper classNames="wl-register-user-team__step-2__content w-full max-w-[500px] mt-[56px] p-8 lg:py-[56px] lg:px-10">
        <Text size="form-title" component="h1" classNames="title">
          Team Profile
        </Text>
        <Line classNames="w-[50%] mt-6 mb-8" />
        <InputFileImage
          onChange={(logo) => handleChangeInput({ name: 'logo', value: logo })}
          image={form?.logo}
          tabIndex={1}
        />
        <Input
          name="name"
          type="text"
          placeholder="Enter team name"
          label="Team Name"
          value={form.name}
          onChange={(e) =>
            handleChangeInput({ name: 'name', value: e?.target?.value })
          }
          tabIndex={2}
          required
        />

        <div className="mt-[72px] w-full flex flex-col lg:flex-row items-center justify-center gap-[18px]">
          <Button
            type="secondary"
            size="lg"
            role="button"
            classNames="w-full lg:max-w-[230px]"
            onClick={() => handleBack(form)}
          >
            Back
          </Button>
          <Button
            type="primary"
            size="lg"
            role="button"
            classNames="w-full lg:max-w-[230px]"
            onClick={() => handleNext(form)}
            disabled={`${form?.name || ''}`?.length === 0}
          >
            Next
          </Button>
        </div>
      </CardWrapper>
    </div>
  )
}
