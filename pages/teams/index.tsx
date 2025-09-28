//ui
import { Image } from '@/molecules/media/Image'
import Title from '@/components/common/Title'
import { IoChevronForward } from 'react-icons/io5'

// helpers
import { getSquad } from '../../helpers/newApi'
import { getTeamLogo } from '../../helpers/getTeamLogo'

// types
import type { Teams } from 'interfaces/team_type'
import { Squad } from '../../interfaces/squad_type'

import type { NextApiResponse, NextApiRequest } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { cx } from 'class-variance-authority'
import { useRouter } from 'next/router'

const teamLinks: Record<string, string> = {
  "臺中連莊": "https://winstreak-volleyball.com/teams",
  "台鋼天鷹": "https://skyhawks-volleyball.com/teams",
  "桃園雲豹飛將": "https://ty-leopards-vb.com/teams",
  "臺北伊斯特": "https://eastpower.tw/players",
}

export default function Teams({ squads }: { squads: Squad[] }) {
  console.log(squads)
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const route = useRouter()

  const handleNavigate = (teamName: string, teamId: number) => {
    const url = teamLinks[teamName]
    if (url) {
      window.open(url, "_blank") // ✅ external link
    } else {
      window.open(`/teams/${teamId}`, "_blank") // fallback: open internal link in new tab
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="wl-home container mx-auto">
      <div className="flex items-center mt-8">
        <div className="flex items-center">
          <Title
            title_text={t('TeamPage.title')}
            fallback="Teams"
            isMobile={isMobile}
          />
        </div>
      </div>
      <div
        className={cx(
          'grid py-8 border border-white divide-white mt-6 w-full h-auto ',
          isMobile ? 'grid-cols-1 divide-y ' : 'grid-cols-4 gap-y-8'
        )}
      >
        {squads.map((squad, index) => (
          <div
            key={squad.id}
            className={cx(
              'flex flex-col items-center justify-center w-full h-full overflow-hidden',
              isMobile ? 'py-10' : 'px-10',
              index % 4 === 3 || isMobile
                ? 'border-r-0'
                : 'border-r border-white'
            )}
          >
            <Image
              alt={squad.name}
              url={getTeamLogo(squad.name) || '/assets/default_team_logo.png'}
              width={isMobile ? 69 : 160}
              height={isMobile ? 69 : 160}
              imageClassNames="h-full w-full"
              objectFit="cover"
              quality={100}
              classNames="rounded-full mb-2 "
            />
            <p
              className={cx(
                'text-white font-bold text-wrap',
                isMobile ? 'text-lg' : 'text-2xl'
              )}
            >
              {squad.name}
            </p>
            <p
              className={cx(
                'text-white font-bold mt-1 text-wrap',
                isMobile ? 'text-base' : 'text-lg'
              )}
            >
              {squad.altName}
            </p>
            <button
              className="mt-4 w-full h-12 border border-white text-white py-2 px-8 text-base flex items-center justify-center gap-2 "
              onClick={() => handleNavigate(squad.name, squad.id)}
            >
              <p className="">{`${t('TeamPage.learn_more')}`}</p>
              <div className="flex items-center justify-center">
                <IoChevronForward className="w-6 h-6" />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  res,
  locale,
}: {
  req: NextApiRequest
  res: NextApiResponse
  query?: {
    [key: string]: string
  }
  locale: string
}) => {
  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const squadsRes = await getSquad(419)
  const squads = squadsRes?.data.data || []

  return {
    props: {
      squads,
      ...(await serverSideTranslations(locale, ['langs'])),
    },
  }
}
