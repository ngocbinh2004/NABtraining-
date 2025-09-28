// helpers
import { beautifyDate } from 'helpers/beautifyDate'
// ui
import Text from '@/atoms/Text'
// constant
import { Events } from 'interfaces/event_type'
import Line from '@/atoms/Line'
import Button from '@/atoms/Button'
import { useCallback, useMemo } from 'react'

interface Props {
  event: Events
  handleClose: (...args: any) => any
}

export default function RuleRegulationModal({ event, handleClose }: Props) {
  const CONTENT = useCallback(() => {
    return {
      Rules: event?.rules || 'Not specified',
      Group: event?.category?.name ?? '-',
      'Guiding Unit': event?.guiding_unit ?? '-',
      Sponsor: event?.sponsor ?? '-',
      'Team capacity': `${event?.team_capacity || '-'}`,
      'Co-organizer': event?.co_organizer ?? '-',
      Location: event?.location ?? '-',
      Description: event?.description || 'Not specified',
    }
  }, [event])

  const __renderContent = useMemo(() => {
    return Object.entries(CONTENT()).map(([key, value]) => {
      if (value !== '-') {
        return (
          <div className={`wl-modal-rule__item flex flex-col gap-1`} key={key}>
            <Text fontWeight="bold">{key}</Text>
            <div className="wl-modal-rule__item__content">
              {value &&
                value
                  ?.split('\n')
                  ?.map((text: string, idx: number) => (
                    <div key={idx}>{text ? text : <br />}</div>
                  ))}
            </div>
          </div>
        )
      }

      return null
    })
  }, [CONTENT])

  return (
    <div
      className="wl-modal-rule mx-[30px] lg:w-[65vw] lg:max-h-[75vh]"
      key={event.id}
    >
      <Text size="h1">Rules and Regulation</Text>
      <Line classNames="mt-4" />
      <div className="wl-modal-rule__body flex flex-col mt-4 gap-4">
        {__renderContent}
      </div>
      <div className="wl-modal-rule__footer text-center mt-10">
        <Button type="primary" size="md" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
