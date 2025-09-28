/* eslint-disable @next/next/no-img-element */

import Line from '@/atoms/Line'
import { EventPill } from '@/atoms/Pill'
import Text from '@/atoms/Text'
import FaqLayout from '@/layout/FaqLayout'

import { eventStatus, matchStatus } from 'constants/gameStatus'

export default function FaqCreateEvent() {
  return (
    <FaqLayout activeTab="event">
      {/* START: steps create event */}
      <Text size="h1">Steps to create event</Text>
      <div className="wl-faq__content w-full flex flex-col gap-6 mt-10">
        <ol className="list-decimal list-inside">
          <li>
            Login with{' '}
            <a href="#notes" className="underline">
              team manager account
            </a>
            <sup className="text-small">1</sup>
          </li>
          <li>
            Go to your profile
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-event-1.webp.png"
              alt="profile menu on header"
            />
          </li>
          <li>Go to Events tab</li>
          <li>
            Click button add new event
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-event-2.webp.png"
              alt="Button add new event"
            />
          </li>
          <li>Fill the form and click confirm</li>
          <li>
            Your event will be created with{' '}
            <a href="#notes" className="underline">
              status
            </a>
            <sup className="text-small">2</sup>{' '}
            <EventPill status={eventStatus.DRAFT} /> and it will not be seen yet
            by other user in the{' '}
            <a href="/events/competition" target="_blank" className="underline">
              competition list page
            </a>
            . The registration start date will determine when the event appears
            on{' '}
            <a href="/events/competition" target="_blank" className="underline">
              that page page
            </a>
          </li>
        </ol>
      </div>
      {/* END: steps create event */}
      <Line classNames="my-20" />
      <Text>
        After the teams registered,
        <br />
        you can create a match with or without{' '}
        <a href="#notes" className="underline">
          rank-table
        </a>
        <sup className="text-small">3</sup>
      </Text>
      {/* START: steps create match */}
      <Text size="h1">Steps to create match</Text>
      <div className="wl-faq__content w-full flex flex-col gap-6 mt-10">
        <ol className="list-decimal list-inside">
          <li>Go to your profile</li>
          <li>Go to Events tab</li>
          <li>
            Click match button on desired event to be redirected to match page
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-match.webp.png"
              alt="register-match"
            />
          </li>
          <li>
            Click button add new match
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-match-2.webp.png"
              alt="add-match-2"
            />
          </li>
          <li>
            [optional] select rank table to match to rank table
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/select-match-rank-table.webp.png"
              alt="select-match-rank-table"
            />
          </li>
          <li>Fill the form and click confirm</li>
          <li>
            Your match will be created with{' '}
            <EventPill status={matchStatus.UPCOMING} /> status. You can later
            changed it.
          </li>
        </ol>
      </div>
      {/* END: steps create match */}
      {/* START: steps create rank table */}
      <Text size="h1">Steps to rank table</Text>
      <div className="wl-faq__content w-full flex flex-col gap-6 mt-10">
        <ol className="list-decimal list-inside">
          <li>Go to your profile</li>
          <li>Go to Events tab</li>
          <li>
            Click rank-table button on desired event to be redirected to rank
            table page
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-rank-table.webp.png"
              alt="register-rank-table"
            />
          </li>
          <li>
            Click button add new rank table
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-rank-table-2.webp.png"
              alt="add-rank-table-2"
            />
          </li>
          <li>
            Fill the form and click confirm
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-rank-table-3.webp.png"
              alt="add-rank-table-3"
            />
          </li>
          <li>Your rank table will be created</li>
        </ol>
      </div>
      {/* END: steps create rank table */}

      {/* START: steps create sets */}
      <Line classNames="my-20" />
      <Text>On every match, you can add several sets</Text>
      <Text size="h1">Steps to create sets</Text>
      <div className="wl-faq__content w-full flex flex-col gap-6 mt-10">
        <ol className="list-decimal list-inside">
          <li>Go to your profile</li>
          <li>Go to Events tab</li>
          <li>
            Click match button on desired event to be redirected to match page
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-match.webp.png"
              alt="register-match"
            />
          </li>
          <li>
            Click set button on desired match to be redirected to set page
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-set-1.webp.png"
              alt="add-set-1"
            />
          </li>
          <li>
            Click button add new set
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-set-2.webp.png"
              alt="add-set-2"
            />
          </li>
          <li>Fill the form and click confirm</li>
          <li>Your set will be created</li>
        </ol>
      </div>
      {/* END: steps create sets */}

      {/* START: steps create record */}
      <Line classNames="my-20" />
      <Text>You can add player record on each sets</Text>
      <Text size="h1">Steps to add record</Text>
      <div className="wl-faq__content w-full flex flex-col gap-6 mt-10">
        <ol className="list-decimal list-inside">
          <li>Go to your profile</li>
          <li>Go to Events tab</li>
          <li>
            Click match button on desired event to be redirected to match page
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-match.webp.png"
              alt="register-match"
            />
          </li>
          <li>
            Click set button on desired match to be redirected to set page
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-set-1.webp.png"
              alt="add-set-1"
            />
          </li>
          <li>
            Click set record button on desired set to be redirected to record
            page
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-set-record-1.webp.png"
              alt="add-set-record-1"
            />
          </li>
          <li>
            Click button add new record
            <img
              className="w-full h-auto"
              src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/add-set-record-2.webp.png"
              alt="add-set-record-2"
            />
          </li>
          <li>Fill the form and click confirm</li>
          <li>Your set record will be created</li>
        </ol>
      </div>
      {/* END: steps create record */}

      {/* START: notes */}
      <div className="wl-faq__notes" id="notes">
        <Line classNames="my-20" />
        <Text size="h1">Notes:</Text>
        <div>
          <sup className="text-sm">1</sup> Please contact our admin to get a
          team manager account.
        </div>
        <div>
          <sup className="text-sm">2</sup> Event status :
          <ol className="list-disc list-inside px-4">
            <li>
              <EventPill status={eventStatus.DRAFT} /> when event is created or
              uncancel. <br />
              Event only shown up to the owner.
            </li>
            <li>
              <EventPill status={eventStatus.OPEN} /> when the registration
              start date is met and event start appearing on{' '}
              <a
                href="/events/competition"
                target="_blank"
                className="underline"
              >
                competition page
              </a>
              <br />. User can only register and unregister during this status.
            </li>

            <li>
              <EventPill status={eventStatus.CLOSED} /> when registration end
              date is met and before event start date
            </li>
            <li>
              <EventPill status={eventStatus.ON_GOING} /> when the start date is
              met
            </li>
            <li>
              <EventPill status={eventStatus.COMPLETED} /> when the end date is
              met.
              <br />
              Completed event can not be canceled or edited
            </li>
            <li>
              <EventPill status={eventStatus.CANCELED} /> when user canceled the
              event <br />
            </li>
          </ol>
        </div>
        <div>
          <sup className="text-sm">3</sup> Rank table is a group of matches, it
          can make complex event less confusing.
          <br />
          Example: lower bracket, upper bracket, team-A, team-B, etc.
        </div>
      </div>
      {/* END: notes */}
    </FaqLayout>
  )
}
