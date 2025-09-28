// components
import Image from '@/molecules/media/Image'

// constants
import BackgroundPattern from '../../../public/assets/Background_Pattern_Bright.svg'

// assets
import { IoChevronForward } from 'react-icons/io5'

// interfaces
import { IindividualType } from 'interfaces/individual_type'
import { ISquad } from 'interfaces/squad_detail_type'
import { IcrewType } from 'interfaces/crew_type'
import { IPersonalInformationType } from 'interfaces/personal_information_type'

// helpers
import { NextApiRequest, NextApiResponse } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { cx } from 'class-variance-authority'
import { getCrew, getRoster, getSquadDetail } from 'helpers/newApi'
import { useTranslation } from 'next-i18next'

export default function TeamPage({
  squad,
  roster,
  crew,
}: {
  squad: ISquad
  roster: IindividualType[]
  crew: IcrewType[]
}) {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="w-full min-h-full">
      <div
        className={cx(
          'w-full bg-[#00A65F] relative',
          isMobile ? 'h-[67px]' : 'h-[172px]'
        )}
      >
        <Image
          alt="background-pattern"
          url={BackgroundPattern}
          width={isMobile ? 67 : 172}
          height={isMobile ? 67 : 172}
          imageClassNames="absolute top-0 left-0"
        />
        <div
          className={cx(
            'w-full flex flex-col items-center absolute',
            isMobile ? 'top-8' : 'top-16'
          )}
        >
          <Image
            alt={squad.name}
            url={squad.logoUrl || '/assets/logo-sky.png'}
            width={isMobile ? 50 : 150}
            height={isMobile ? 50 : 150}
            objectFit="cover"
            quality={100}
            imageClassNames="h-full w-full"
          />
          <p
            className={cx(
              'text-white',
              isMobile ? 'mt-4 text-lg' : 'mt-6 text-[28px]'
            )}
          >
            {squad.name} / {squad.altName}
          </p>
          <button
            className={cx(
              'mt-6 w-auto bg-[#009919] text-white py-2 px-4 flex items-center justify-center gap-2',
              isMobile ? 'text-sm h-[35px]' : 'text-lg h-[51px]'
            )}
          >
            <p>{t('TeamPage.learn_more')}</p>
            <IoChevronForward className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        className={cx(
          'wl-home container mx-auto',
          isMobile ? 'mt-32' : 'mt-48'
        )}
      >
        {/* Team Manager Section */}
        <Section title={t('TeamPage.management_team')} isMobile={isMobile}>
          {crew
            .filter(
              (person) =>
                !(
                  person.positions[0].includes('Coach') ||
                  person.positions[0].includes('Trainer')
                )
            )
            .map((person) => (
              <Card
                key={person.id}
                person={person.personalInfo}
                roleLabel={
                  person.positions[0] === 'Manager'
                    ? t('TeamPage.role.manager')
                    : person.positions[0] === 'Leader'
                      ? t('TeamPage.role.leader')
                      : person.positions[0] === 'Chairman'
                        ? t('TeamPage.role.chairman')
                        : person.positions[0]
                          ? t('TeamPage.role.general_manager')
                          : person.positions[0]
                }
                isMobile={isMobile}
              />
            ))}
        </Section>

        {/* Coaching Staff */}
        <Section title={t('TeamPage.coaching_staff')} isMobile={isMobile}>
          {crew
            .filter(
              (person) =>
                person.positions[0].includes('Coach') ||
                person.positions[0].includes('Trainer')
            )
            .map((person) => (
              <Card
                key={person.id}
                person={person.personalInfo}
                roleLabel={
                  person.positions[0] === 'HeadCoach'
                    ? t('TeamPage.role.head_coach')
                    : person.positions[0] === 'Coach'
                      ? t('TeamPage.role.coach')
                      : person.positions[0] === 'AssistantCoach'
                        ? t('TeamPage.role.assistant_coach')
                        : person.positions[0] === 'AthleticTrainer'
                          ? t('TeamPage.role.athletic_trainer')
                          : person.positions[0] === 'Trainer'
                            ? t('TeamPage.role.trainer')
                            : person.positions[0] === 'GeneralManager'
                              ? t('TeamPage.role.general_manager')
                              : person.positions[0]
                }
                isMobile={isMobile}
              />
            ))}
        </Section>

        {/* Players */}
        <Section title={t('TeamPage.player')} isMobile={isMobile}>
          {roster.map((player) => (
            <Card
              key={player.id}
              person={player.personalInfo}
              roleLabel={
                player.position === 'WingSpiker'
                  ? String(t('TeamPage.position.wing_spiker'))
                  : player.position === 'OutsideHitter'
                    ? String(t('TeamPage.position.outside_hitter'))
                    : player.position === 'OppositeHitter'
                      ? String(t('TeamPage.position.opposite_hitter'))
                      : player.position === 'Setter'
                        ? String(t('TeamPage.position.setter'))
                        : player.position === 'MiddleBlocker'
                          ? String(t('TeamPage.position.middle_blocker'))
                          : player.position === 'Libero'
                            ? String(t('TeamPage.position.libero'))
                            : player.position === 'DefensiveSpecialist'
                              ? String(t('TeamPage.position.defensive_specialist'))
                              : player.position === 'ServingSpecialist'
                                ? String(t('TeamPage.position.serving_specialist'))
                                : String(player.position)
              }
              isMobile={isMobile}
              jerseyNumber={player.jerseyNumber}
              height={player.height}
              weight={player.weight}
            />
          ))}
        </Section>
      </div>
    </div>
  )
}

// Sub-components
function Section({
  title,
  isMobile,
  children,
}: {
  title: string
  isMobile: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <div className={cx('flex items-center', isMobile ? 'mt-4' : 'mt-6')}>
        <Image
          alt="Yellow Star"
          url="/assets/yellow_star.png"
          width={32}
          height={32}
          classNames="mr-3"
        />
        <p className="text-white text-2xl lg:text-[28px] font-bold">{title}</p>
      </div>
      <div
        className={cx(
          'grid px-4 py-8 w-full h-auto gap-4',
          isMobile ? 'grid-cols-2' : 'grid-cols-4'
        )}
      >
        {children}
      </div>
    </>
  )
}

function Card({
  person,
  roleLabel,
  isMobile,
  jerseyNumber,
  height,
  weight,
}: {
  person: IPersonalInformationType
  roleLabel: string
  isMobile: boolean
  jerseyNumber?: string
  height?: number
  weight?: number
}) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center border border-white background-card boxBlurShadow w-full h-full',
        isMobile ? 'p-4' : 'p-6'
      )}
    >
      <Image
        alt={person.name}
        url={person?.avatarUrl || "/assets/no-image-available.png"}
        imageClassNames={cx('min-w-full', isMobile ? 'h-[190px]' : 'h-[328px]')}
        objectFit="cover"
        quality={100}
        classNames={cx('min-w-full mb-2', isMobile ? 'h-[190px]' : 'h-[328px]')}
      />
      <hr className="my-2 bg-white w-full" />
      <div
        className={cx(
          'flex w-full items-start',
          isMobile ? 'flex-col' : 'justify-between gap-16'
        )}
      >
        <p
          className={cx(
            'text-white w-1/4 text-wrap',
            isMobile ? 'text-sm' : 'text-lg'
          )}
        >
          {roleLabel}
        </p>
        <div className="flex flex-col items-start justify-center overflow-hidden flex-grow">
          <div className="flex items-center justify-between mb-1 w-full gap-2">
            <p className={cx('text-white', isMobile ? 'text-base' : 'text-xl')}>
              {jerseyNumber !== undefined ? `#${jerseyNumber}` : ''}
            </p>
            <p
              className={cx(
                'text-white truncate',
                isMobile ? 'text-base' : 'text-xl'
              )}
            >
              {person.name}
            </p>
          </div>

          {height && weight && (
            <p
              className={cx(
                'text-white text-nowrap',
                isMobile ? 'text-xs' : 'text-base'
              )}
            >
              {height} cm / {weight} kg
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Server-side props
export const getServerSideProps = async ({
  res,
  query,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: { [key: string]: string }
  locale: string
}) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const team_id = Number(query?.id || 0)
  const squadRes = await getSquadDetail(team_id)
  const squad = squadRes?.data?.data || {}

  const rosterRes = await getRoster(team_id)
  const roster = rosterRes?.data?.data || []

  const crewRes = await getCrew(team_id)
  const crew = crewRes?.data?.data || []

  return {
    props: {
      squad,
      roster,
      crew,
      ...(await serverSideTranslations(locale, ['langs'])),
    },
  }
}
