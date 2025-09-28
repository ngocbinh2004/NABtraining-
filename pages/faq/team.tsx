/* eslint-disable @next/next/no-img-element */
// ui
import { EventPill } from '@/atoms/Pill'
import Text from '@/atoms/Text'
import LinkText from '@/molecules/LinkText'
import FaqLayout from '@/layout/FaqLayout'
// constants
import { eventStatus } from 'constants/gameStatus'

export default function FaqRegisterTeam() {
  return (
    <FaqLayout activeTab="team">
      {/* START: steps register */}
      <Text size="h1">Steps to register team</Text>
      <div className="wl-faq__content w-full flex flex-col gap-6 mt-10">
        <ol className="list-decimal list-inside">
          <li>
            Login with team manager account<sup className="text-sm">1</sup>.
          </li>
          <li>
            You can either do it on competition list page or on competition
            detail page.
            <br />
            <div className="flex flex-col px-8">
              <Text classNames="uppercase font-bold">competition list</Text>
              <ul className="list-disc list-inside ml-10">
                <li>
                  Go to competition<sup className="text-sm">2</sup> list{' '}
                  <LinkText href="/events/competition" target="_blank" underlined>
                    page
                  </LinkText>
                  .
                </li>
                <li>
                  Click register button.
                  <img
                    src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-team-1--a.webp.png"
                    alt="register from competition list page"
                  />
                </li>
                <li>
                  Select the team and click confirm.
                  <sup className="text-sm">3</sup>.
                  <img
                    src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-team-3.webp.png"
                    alt="select team to register from competition list page"
                  />
                </li>
              </ul>
              <Text classNames="uppercase font-bold">competition detail</Text>
              <ul className="list-disc list-inside ml-10">
                <li>
                  Go to competition<sup className="text-sm">2</sup> list{' '}
                  <LinkText href="/events/competition" target="_blank" underlined>
                    page
                  </LinkText>
                  .
                </li>
                <li>
                  Click More button.
                  <img
                    src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-team-1--b.webp.png"
                    alt="go to competition detail page"
                  />
                </li>
                <li>
                  You will be redirected to competition detail page, click
                  register.
                  <img
                    src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-team-2.webp.png"
                    alt="go to competition detail page"
                  />
                </li>
                <li>
                  Select the team and click confirm.
                  <sup className="text-sm">3</sup>.
                  <img
                    src="https://vlw-s3-qa1.s3.ap-southeast-1.amazonaws.com/register-team-3.webp.png"
                    alt="select team to register from competition list page"
                  />
                </li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
      {/* END: steps register */}

      {/* START: notes */}
      <div className="wl-faq__notes mt-20">
        <Text size="h1">Notes:</Text>
        <div>
          <sup className="text-sm">1</sup> Please contact our admin to get a
          team manager account.
        </div>
        <div>
          <sup className="text-sm">2</sup> You can only registered to{' '}
          <EventPill status={eventStatus.OPEN} /> event between the registration
          start and end date.
        </div>
        <div>
          <sup className="text-sm">3</sup> You can repeat the process to
          register more team.
        </div>
      </div>
      {/* END: notes */}
    </FaqLayout>
  )
}
