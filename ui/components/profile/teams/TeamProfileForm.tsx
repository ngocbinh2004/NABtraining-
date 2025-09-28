import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
// hooks
import { useCategories } from 'hooks/useCategories'
// helpers
import { validateTeamProfileForm } from 'helpers/validation'
import { PUT, POST_NEW as POST } from 'helpers/ssrRequest'
import uploadImage from 'helpers/upload'
// ui
import Line from '@/atoms/Line'
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import InputFileImage from '@/molecules/form/InputFileImage'
import TextArea from '@/molecules/form/TextArea'
import Select from '@/molecules/form/Select'
import Input from '@/molecules/form/Input'
// import InputDatepicker from '@/molecules/form/InputDatepicker'
import InputDate from '@/molecules/form/InputDate'
import { ModalOk } from '@/organisms/Modal'

// constants
import { ICategory } from 'interfaces/category_type'

type TFormData = {
  id?: number
  name?: string
  abbreviation?: string
  logo?: string
  description?: string
  categoryId?: number
  established?: string
}
interface Props {
  user: number
  formData?: TFormData
  handleBack: (...args: any) => any
}

export default function TeamProfileForm({
  formData = {},
  handleBack,
  user,
}: Props) {
  // Query
  const { data: categories, isSuccess: isFetchCategorySuccess } = useCategories(
    '',
    true
  )
  // State
  const [_, setDateFocus] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [error, setError] = useState<{
    [key: string]: any
  }>({})

  const [form, setForm] = useState({
    id: formData?.id || undefined,
    logo: formData?.logo,
    name: formData?.name,
    abbreviation: formData?.abbreviation || undefined,
    categoryId: formData?.categoryId || undefined,
    description: formData?.description || undefined,
    established: formData?.established
      ? new Date(+formData?.established).toISOString().split('T')[0]
      : undefined,
  })

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateEditTeam, isLoading } = useMutation({
    mutationFn: ({
      abbreviation,
      name,
      logo,
      established,
      description,
      categoryId,
      id,
    }: TFormData) => {
      const body = {
        name,
        logo,
        established: established ? new Date(established).getTime() : undefined,
        description,
        category_id: categoryId,
        abbreviation,
      }
      if (id) {
        return PUT(`teams?id=${id}`, body)
      }
      return POST('teams', body)
    },
    onSuccess: (_response: any) => {
      queryClient.invalidateQueries({
        queryKey: ['user-team', `user_id=${user}`],
      })
      toast('Team saved!')
      handleBack()
    },
    onError: (error: any) => {
      setShowErrorModal(true)
      setErrorMessage(`${error?.message || error}`)
    },
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
    if (!error?.[name]) return
    setError((error) => ({
      ...error,
      [name]: undefined,
    }))
  }

  const handleSubmit = async () => {
    const { success, error = {} } = validateTeamProfileForm(form)
    if (!success) {
      return setError(error)
    }

    let newUrl
    if (form?.logo && form.logo.startsWith('data:image')) {
      newUrl = await uploadImage({
        name: `${form?.name}`,
        image: form.logo,
      })
    }

    return mutateEditTeam({
      ...form,
      logo: newUrl || form.logo,
    })
  }

  // Var
  const categoriesOption =
    isFetchCategorySuccess && categories?.data?.length > 0
      ? categories.data.map((category: ICategory) => ({
          label: category?.name,
          value: category?.id,
        }))
      : null

  return (
    <div className="form-team-profile">
      <div className="form-team-profile__form w-[90vw] md:w-[600px] flex flex-col gap-4 items-start text-left">
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
          error={error.name}
          tabIndex={2}
          required
        />
        <Input
          name="abbreviation"
          type="text"
          placeholder="Enter team abbreviation"
          label="Team Abbreviation"
          value={form.abbreviation}
          onChange={(e) =>
            handleChangeInput({ name: 'abbreviation', value: e?.target?.value })
          }
          error={error.abbreviation}
          tabIndex={3}
          required
        />
        <Select
          name="categoryId"
          placeholder="Select your category"
          onChange={(option: any) => {
            handleChangeInput({ name: 'categoryId', value: +option })
          }}
          selectedOption={form.categoryId}
          options={categoriesOption}
          label="Category"
          error={error.categoryId}
          tabIndex={4}
          required
        />
        {/* <InputDatepicker
          tabIndex={4}
          onChange={(established: any) =>
            handleChangeInput({ name: 'established', value: established })
          }
          dateFormat="dd/MM/yyyy"
          placeholder="dd/MM/yyyy"
          name="established"
          label="Established"
          date={form.established}
          error={error.established}
        /> */}
        <InputDate
          tabIndex={5}
          onFocus={() => setDateFocus(true)}
          onBlur={() => setDateFocus(false)}
          onChange={(established: any) =>
            handleChangeInput({ name: 'established', value: established })
          }
          placeholder="dd/MM/yyyy"
          name="established"
          label="Established"
          value={form.established}
          error={error.established}
        />
        <TextArea
          name="description"
          placeholder="Enter description"
          label="Description"
          value={form.description}
          onChange={(e) =>
            handleChangeInput({ name: 'description', value: e?.target?.value })
          }
          error={error.description}
          tabIndex={6}
        />
        <div className="mt-[72px] w-full flex flex-col lg:flex-row items-center justify-center gap-[18px]">
          <Button
            type="secondary"
            size="lg"
            role="button"
            classNames="w-full lg:max-w-[230px]"
            onClick={handleBack}
            disabled={isLoading}
            isLoading={isLoading}
            tabIndex={7}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="lg"
            role="button"
            classNames="w-full lg:max-w-[230px]"
            onClick={handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
            tabIndex={8}
          >
            Confirm
          </Button>
        </div>
      </div>
      <ModalOk
        showModal={showErrorModal}
        title="Failed to update team"
        message={errorMessage || 'Something gone wrong'}
        labelOk="Retry"
        handleCloseModal={() => {
          setShowErrorModal(false)
        }}
      />
    </div>
  )
}
