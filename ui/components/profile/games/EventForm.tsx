// @TODO: mark the components with hook
// @TODO: mark the components with modal confirmation
import { useState } from 'react'
import { cx } from 'class-variance-authority'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
// hooks
import { useEvents } from 'hooks/useEvents'
import { useCategories } from 'hooks/useCategories'
// helpers
import { PUT, POST_NEW as POST } from 'helpers/ssrRequest'
import { validateEventProfileForm } from 'helpers/validation'
// ui
import Text from '@/atoms/Text'
import Button from '@/atoms/Button'
import Line from '@/atoms/Line'
import Input from '@/molecules/form/Input'
import { InputDateRangePicker } from '@/molecules/form/InputDatepicker'
import TextArea from '@/molecules/form/TextArea'
import Select from '@/molecules/form/Select'
import InputFileImage from '@/molecules/form/InputFileImage'
import { ModalOk } from '@/organisms/Modal'
// constants
import { Events } from 'interfaces/event_type'
import { ICategory } from 'interfaces/category_type'

interface Props {
  eventId?: number
  handleBack: (...arg: any) => any
}

export default function EventForm({ eventId, handleBack }: Props) {
  // State
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Query
  const queryClient = useQueryClient()
  const { mutate: mutateSaveEvent, isLoading: isSaveEventLoading } =
    useMutation({
      mutationFn: (form?: Events) => {
        if (eventId) {
          return PUT(`events?id=${eventId}`, form)
        }
        return POST('events', form)
      },
      onSuccess: (_response: any) => {
        toast('Event saved!')
        queryClient.invalidateQueries({
          queryKey: ['user-events'],
        })
        handleBack()
      },
      onError: (error: any) => {
        setShowErrorModal(true)
        setError(`${error?.message || error}`?.substring(0, 100))
      },
    })

  // Function
  const handleSubmit = (form: Events) => mutateSaveEvent(form)

  return (
    <div key={eventId}>
      {/* START: Modal Event */}
      <div className={cx('wl-profile-event__form', 'p-4 lg:py-[30px] lg:px-8')}>
        <Text size="form-title" component="h1" classNames="title">
          {eventId ? 'Edit Event' : 'Create Event'}
        </Text>
        <Line classNames="w-[50%] mt-6 mb-8" />
        {eventId ? (
          <EditEvent
            eventId={eventId}
            handleSubmit={handleSubmit}
            handleBack={handleBack}
            isLoading={isSaveEventLoading}
          />
        ) : (
          <Form
            handleSubmit={handleSubmit}
            handleBack={handleBack}
            isLoading={isSaveEventLoading}
          />
        )}
      </div>
      {/* END: Modal Event */}

      {/* START: Modal Error */}
      <ModalOk
        showModal={showErrorModal}
        title="Failed to save event"
        message={error}
        labelOk="OK"
        handleCloseModal={() => setShowErrorModal(false)}
      />
      {/* END: Modal Error */}
    </div>
  )
}

function EditEvent({
  eventId,
  handleSubmit,
  handleBack,
  isLoading,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  eventId: number
  isLoading?: boolean
}) {
  const { data: events, isLoading: isFetchLoading } = useEvents(
    `id=${eventId}`,
    !!eventId
  )

  if (isFetchLoading) return null
  const [event] = events?.data || []
  return (
    <Form
      handleSubmit={handleSubmit}
      handleBack={handleBack}
      initialData={{
        image: event?.image,
        category: event?.category_id,
        guidingUnit: event?.guiding_unit,
        name: event?.name,
        capacity: event?.team_capacity || 0,
        sponsor: event?.sponsor,
        location: event?.location,
        description: event?.description,
        rules: event?.rules,
        coOrganizer: event?.co_organizer,
        endDate: event?.end_date ? new Date(+event?.end_date) : undefined,
        startDate: event?.start_date ? new Date(+event?.start_date) : undefined,
        registerEndDate: event?.register_end_date
          ? new Date(+event?.register_end_date)
          : undefined,
        registerStartDate: event?.register_start_date
          ? new Date(+event?.register_start_date)
          : undefined,
      }}
      isLoading={isLoading}
    />
  )
}

function Form({
  handleSubmit,
  initialData = {},
  handleBack,
  isLoading,
}: {
  handleBack: (...args: any) => any
  handleSubmit: (...args: any) => any
  initialData?: any
  isLoading?: boolean
}) {
  // State
  const [form, setForm] = useState<{ [key: string]: any }>({ ...initialData })
  const [error, setError] = useState<{
    [key: string]: any
  }>({})

  // Query
  const { data: categories, isSuccess: isFetchCategorySuccess } = useCategories(
    '',
    true
  )

  const categoriesOption =
    categories?.data?.length > 0
      ? categories.data.map((category: ICategory) => ({
          label: category?.name,
          value: category?.id,
        }))
      : null

  // Function
  const validateForm = (form: any) => {
    const { success, error } = validateEventProfileForm(form)
    if (success) return true
    setError(error)
    return false
  }
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({
      ...form,
      [e?.target?.name]: e?.target?.value,
    }))
    if (error?.[e?.target?.name]) {
      setError((error) => ({
        ...error,
        [e?.target?.name]: undefined,
      }))
    }
  }
  const handleChangeInputNonText = ({
    name,
    value,
  }: {
    name: string
    value: any
  }) => {
    setForm((form) => ({
      ...form,
      [name]: value,
    }))

    if (error?.[name]) {
      setError((error) => ({
        ...error,
        [name]: undefined,
      }))
    }
  }

  if (!isFetchCategorySuccess) return null

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (validateForm(form)) {
          handleSubmit({
            name: form.name,
            category_id: form.category,
            team_capacity: +form.capacity || 0,
            sponsor: form.sponsor,
            co_organizer: form.coOrganizer,
            guiding_unit: form.guidingUnit,
            description: form.description,
            location: form.location,
            rules: form.rules,
            start_date: form.startDate
              ? Math.round(new Date(form.startDate).getTime())
              : null,
            end_date: form.endDate
              ? Math.round(new Date(form.endDate).getTime())
              : null,
            register_start_date: form.registerStartDate
              ? Math.round(new Date(form.registerStartDate).getTime())
              : null,
            register_end_date: form.registerEndDate
              ? Math.round(new Date(form.registerEndDate).getTime())
              : null,
            image: form.image,
          })
        }
      }}
    >
      <InputFileImage
        onChange={(logo) =>
          handleChangeInputNonText({ name: 'image', value: logo })
        }
        image={form?.image}
        tabIndex={1}
        isSquare
        maxSizeInKB={1000}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Input
          name="name"
          type="text"
          placeholder="Enter cup name"
          label="Name"
          value={form.name}
          onChange={handleChangeInput}
          error={error.name}
          tabIndex={1}
          required
        />
        <Input
          name="capacity"
          type="number"
          placeholder="Enter capacity"
          label="Capacity"
          value={form.capacity}
          onChange={handleChangeInput}
          error={error.capacity}
          tabIndex={2}
          required
        />

        {/* category */}
        <Select
          name="category"
          placeholder="Select your category"
          onChange={(option: any) => {
            handleChangeInputNonText({ name: 'category', value: +option })
          }}
          selectedOption={form.category}
          options={categoriesOption}
          label="Category"
          error={error.category}
          tabIndex={3}
          required
        />
        <Input
          name="guidingUnit"
          type="text"
          placeholder="Enter guiding unit"
          label="Guiding unit"
          value={form.guidingUnit}
          onChange={handleChangeInput}
          error={error.guidingUnit}
          tabIndex={4}
        />
        <InputDateRangePicker
          startDate={{
            required: true,
            tabIndex: 5,
            onChange: (date: any) =>
              handleChangeInputNonText({
                name: 'registerStartDate',
                value: date,
              }),
            dateFormat: 'dd/MM/yyyy HH:mm',
            name: 'registerStartDate',
            label: 'Register Start Date',
            date: form.registerStartDate,
            error: error?.registerStartDate,
            placeholder: 'dd/MM/yyyy HH:mm',
            showTimeSelect: true,
            hoverableText:
              'Event will start appearing in the competition page after this time',
          }}
          endDate={{
            required: true,
            tabIndex: 6,
            onChange: (date: any) =>
              handleChangeInputNonText({
                name: 'registerEndDate',
                value: date,
              }),
            dateFormat: 'dd/MM/yyyy HH:mm',
            name: 'registerEndDate',
            label: 'Register End Date',
            date: form.registerEndDate,
            error: error?.registerEndDate,
            placeholder: 'dd/MM/yyyy HH:mm',
            showTimeSelect: true,
            hoverableText:
              'Event can not be registered anymore after this time',
          }}
        />
        <InputDateRangePicker
          startDate={{
            tabIndex: 7,
            required: true,
            onChange: (date: any) =>
              handleChangeInputNonText({ name: 'startDate', value: date }),
            name: 'startDate',
            dateFormat: 'dd/MM/yyyy HH:mm',
            error: error?.startDate,
            label: 'Start Date',
            date: form.startDate,
            placeholder: 'dd/MM/yyyy HH:mm',
            showTimeSelect: true,
            hoverableText:
              'Other user will see this event is on progress after this time',
          }}
          endDate={{
            tabIndex: 8,
            required: true,
            onChange: (date: any) =>
              handleChangeInputNonText({ name: 'endDate', value: date }),
            name: 'endDate',
            dateFormat: 'dd/MM/yyyy HH:mm',
            label: 'End Date',
            date: form.endDate,
            error: error?.endDate,
            placeholder: 'dd/MM/yyyy HH:mm',
            showTimeSelect: true,
            hoverableText:
              'Other user will see this event as completed after this time',
          }}
        />
      </div>
      <div className="grid grid-cols-1 mt-8 gap-8">
        <TextArea
          name="sponsor"
          placeholder="Enter sponsor"
          label="Sponsor"
          value={form.sponsor}
          onChange={handleChangeInput}
          error={error.sponsor}
          tabIndex={9}
        />
        <TextArea
          name="coOrganizer"
          placeholder="Enter Co-organizer"
          label="Co-organizer"
          value={form.coOrganizer}
          onChange={handleChangeInput}
          error={error.coOrganizer}
          tabIndex={10}
        />
        <TextArea
          name="location"
          placeholder="Enter location"
          label="Location"
          value={form.location}
          onChange={handleChangeInput}
          error={error.location}
          tabIndex={11}
          required
        />
        <TextArea
          name="rules"
          placeholder="Enter rules"
          label="Rules"
          value={form.rules}
          onChange={handleChangeInput}
          error={error.rules}
          tabIndex={12}
        />
        <TextArea
          name="description"
          placeholder="Enter description"
          label="Description"
          value={form.description}
          onChange={handleChangeInput}
          error={error.description}
          tabIndex={13}
        />
      </div>
      <div className="md:mt-[72px] w-full items-center flex flex-col md:flex-row md:justify-center gap-4">
        <Button
          type="secondary"
          size="lg"
          role="button"
          classNames="w-full lg:max-w-[230px]"
          onClick={handleBack}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Close
        </Button>
        <Button
          type="primary"
          size="lg"
          role="submit"
          classNames="w-full lg:max-w-[230px]"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
