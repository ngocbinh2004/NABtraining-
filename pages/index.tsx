import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import type { NextApiResponse, NextApiRequest } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { RiArrowRightSLine } from 'react-icons/ri'
import Icon from '@/atoms/Icon'
import Text from "@/atoms/Text"
import Image from "@/molecules/media/Image"
import IMatchStats, { ISquad as squadMatchStats } from 'interfaces/match_stats_type'

// helpers
import {
  getBanners,
  getAnnouncement,
  getPartners,
  getLeagueRecord,
} from 'helpers/api'
import { getEvents, getMatches, getMatchStats, getSeasons, getSquad } from 'helpers/newApi'
// ui
import LinkText from '@/molecules/LinkText'
import Announcement from '@/components/announcement/Announcement'
import Partners from '@/components/partners/Partners'
import Schedule from '@/components/schedule/Schedule'
import TeamRanking from '@/components/table/TeamRanking'
import YearPicker from '@/components/year-picker/YearPicker'
// constants
import { IBanner } from 'interfaces/banner_type'
import { IAnnouncement } from 'interfaces/announcement_type'
import { Banner } from '@/components/banner/Banner'
import { IPartner } from 'interfaces/partner_type'
import { ISchedules } from 'interfaces/schedule_type'
import { matchStatus } from 'constants/gameStatus'
import { ILeagueRankingType } from 'interfaces/league_ranking_type'
import { ITeamRecordType } from 'interfaces/team_record_type'
import Title from '@/components/common/Title'
import { ISquad } from 'interfaces/squad_detail_type'
import { ISeason } from 'interfaces/season_type'
import { IApiEvent } from 'interfaces/event_type'
import { IRecord } from 'interfaces/battle_data_type'
import createTeamRecord from 'helpers/createTeamRecord'
import HomeTeamRanking from '@/components/table/HomeTeamRanking'

interface IProps {
  banners?: IBanner[]
  announcements?: IAnnouncement[]
  partners?: IPartner[]
  scheduleMatchs?: ISchedules[]
  matchResult?: ISchedules[]
  rankingsData: ILeagueRankingType
  squads?: ISquad[]
}

export default function Home({
  banners,
  announcements,
  partners,
  scheduleMatchs,
  matchResult,
  rankingsData,
  squads,
}: IProps) {
  const router = useRouter()
  // const minYear = Math.min(
  //   ...(rankingData ?? []).map((item: ILeagueRankingType) => item.year)
  // )
  // const maxYear = Math.max(
  //   ...(rankingData ?? []).map((item: ILeagueRankingType) => item.year)
  // )
  const [currentYear, setCurrentYear] = useState(rankingsData?.year ?? 0)
  const [currentTeamData, setCurrentTeamData] = useState<ITeamRecordType[]>(rankingsData?.teams_record)
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const recordTitle = currentYear ? (currentYear + "-" + (currentYear + 1).toString().slice(2, 4)) : "";

  const squadsMap = useMemo(() => {
    return new Map<number, ISquad>(
      (squads ?? []).map(squad => [squad.id, squad])
    )
  }, [squads])

  // helper for record table
  // const handleYearChange = (type: string) => {
  //   if (type === 'prev') {
  //     setCurrentYear((prev) => Math.max(prev - 1, minYear))
  //   } else if (type === 'next') {
  //     setCurrentYear((prev) => Math.min(prev + 1, maxYear))
  //   }
  // }

  const handleSetData = useCallback(() => 
    {
      if (rankingsData?.teams_record && rankingsData.teams_record.length > 0) 
      {
        setCurrentTeamData(rankingsData.teams_record)
      }
    },
    [rankingsData]
  )

  useEffect(() => {
    setCurrentTeamData([])
    handleSetData()
  }, [currentYear, handleSetData])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="wl-home">
      <div className="w-full relative flex items-center justify-center">
        {banners && banners.length > 0 && <Banner banners={banners} />}
      </div>
      <div className={`container mx-auto mb-3`}>
        <div className="flex justify-between items-center mt-2 mb-1 lg:mb-6">
          <div className="flex justify-center items-center">
            <Title
              title_text={t('MainPage.Announcement.announcement_title')}
              fallback="Announcement"
              isMobile={isMobile}
            />
          </div>
          <div className="cursor-pointer flex items-center">
            <LinkText
              href="/announcement/announcement"
              size="body2"
              classNames="text-white font-medium flex items-center text-base lg:text-lg"
            >
              {t('MainPage.Announcement.see_more')}
              <RiArrowRightSLine size={24} className="ml-1 text-white" />
            </LinkText>
          </div>
        </div>
        <Announcement announcements={announcements} isFirstPage={true} />
        <Schedule
          incomingMatch={scheduleMatchs}
          resultMatchData={matchResult}
          squadsMap={squadsMap}
        />

        {/*Record*/}
        <div className="mx-auto flex flex-col mt-8">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              <Title
                title_text= {`${recordTitle} ${t('Record.record')}`.trim()}
                fallback='Team Statistics'
                isMobile={isMobile}
              />
            </div>
            <div className="flex items-center cursor-pointer">
              <LinkText
                href="/record"
                size="body2"
                classNames="text-white font-medium flex items-center text-base lg:text-lg"
              >
                {t('Record.see_more')}
                <RiArrowRightSLine size={24} className="ml-1 text-white" />
              </LinkText>
            </div>
          </div>
          {(!rankingsData) ? (
            <div className="border border-white boxBlurShadow mt-4 w-full lg:px-[64px] p-4 lg:py-8">
              <div className="flex flex-row items-center justify-center">
                <div className="w-1/8 flex justify-end">
                  <Image
                    classNames="min-w-[52px] w-[52px] min-h-[45px] h-[45px]"
                    alt="news logo"
                    url="/assets/yellow_star.png"
                    imageClassNames="h-full rounded-t px-2 py-1"
                    objectFit="object-contain"
                  />
                </div>
                <div className="w-7/8">
                  <Text
                    size="unset"
                    classNames="font-tertiary text-white text-center w-full text-[26px] leading-[30px] pt-[30px]"
                  >
                    {t("ComingSoon.title")}
                  </Text>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full mt-1 lg:mt-6 overflow-auto border border-white boxBlurShadow">
                <HomeTeamRanking key={currentYear} teamData={currentTeamData}/>
              </div>
              {/* <YearPicker
                currentYear={currentYear}
                minYear={minYear}
                maxYear={maxYear}
                handleYearChange={handleYearChange}
              /> */}
            </>
          )}
        </div>
        <Partners partners={partners || []} />
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
  const leagueId = process.env.NEXT_CUSTOMER_LEAGUE_ID
  if (!leagueId) { return { notFound: true } as const; }

  const [banners, announcements, partners, allMatches, seasons] = await Promise.all([
    getBanners(),
    getAnnouncement(),
    getPartners(),
    getMatches(`?leagueId=${leagueId}`),
    getSeasons(leagueId),
  ]);
  const squadArray: ISquad[] = []

  const filteredMatches = allMatches?.data?.data?.filter((match: ISchedules) => {
    const matchDate = new Date(match.matchedAt)
    return matchDate.getFullYear() < 2026
  }) || []

  //Preload Squads 
  let uniqueEventIds: number[] = []
  if (filteredMatches.length > 0) {
    uniqueEventIds = Array.from(
      new Set(filteredMatches.map((match: ISchedules) => match.eventId))
    );
  }
  if (uniqueEventIds.length > 0) {
    const allSquadNested = await Promise.all(
      uniqueEventIds.map(async (eventId) => {
        const res = await getSquad(eventId)
        return res?.data?.data || [];
      })
    );
    squadArray.push(...allSquadNested.flat());
  }


  //Fetch data for record component
  const seasonList: ISeason[] = seasons?.data?.data || [];
  let rankingsData = null;

  if (seasonList.length){
    seasonList.sort((a, b) => {
      const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
      const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
      return dateB - dateA;
    });
    const yearList = seasonList.map(ss => (new Date(ss.startTime)).getFullYear());

    //Since the Figma design assumes one event per season, I only fetch the latest event of the season from the API.
    const season = seasonList[0];
    const events: IApiEvent[] = (await getEvents(season.id))?.data?.data;
    events.sort((a, b) => {
      const dateA = a.registrationStartTime ? new Date(a.registrationStartTime).getTime() : 0;
      const dateB = b.registrationStartTime ? new Date(b.registrationStartTime).getTime() : 0;
      return dateB - dateA;
    });
    const lastestEvent = events[0]

    const [squads, matches]: [ISquad[], ISchedules[]] = await Promise.all([
      getSquad(lastestEvent.id).then(res => res?.data?.data ?? [] as ISquad[]),
      getMatches(`?eventId=${lastestEvent.id}`).then(res => res?.data?.data ?? [] as ISchedules[])
    ]);

    const filterMatches = matches.filter(m => (m.status === 'COMPLETED') && (m.squadMatchResults))
    
    //If there are results for the matches, then initialize the value for rankingsData
    if(filterMatches.length > 0){
      const matchMap = new Map<number, ISchedules>();
      filterMatches.forEach(m => {
        matchMap.set(m.id, m)
      });

      const squadMap = new Map<number, ISquad>();
      squadMap.forEach(sq => {
        squadMap.set(sq.id, sq)
      });

      const squadMatchStatsList = (
        await Promise.all(
          filterMatches.map(async (m) => (await getMatchStats(m.id))?.data?.data?.squads ?? [])
        )
      ).flat() as squadMatchStats[];

      // Ex. Map({1 => [{}, {}, {}]}, {2 => [{}, {}, {}]})
      const squadStatsMap = new Map<number, squadMatchStats[]>()
      for (const stat of squadMatchStatsList) {
        if (!squadStatsMap.has(stat.squadId)) {
          squadStatsMap.set(stat.squadId, [])
        }
        const arr = squadStatsMap.get(stat.squadId) ?? []
        arr.push(stat)
      }

      const squadRecordList: ITeamRecordType[] = [];
      for (const squad of squads){
        const matchStatsArr: squadMatchStats[] = squadStatsMap.get(squad.id) || [];
      
        const teamRecord: ITeamRecordType = createTeamRecord(matchStatsArr, squad, squads.length);
        squadRecordList.push(teamRecord);
      }
      squadRecordList.sort((a, b) => b.points - a.points)

      rankingsData = {
        teams_record: squadRecordList,
        seasonId: season.id,
        eventId: lastestEvent.id,
        year: new Date(season.startTime).getFullYear(),
        eventName: lastestEvent.name
      }
    }
    
  }

  // set cache
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      banners: banners?.data?.data
        ? banners?.data?.data
          ?.filter((banner: IBanner) => !!banner?.image)
          .slice(0, 5)
        : [],
      announcements: announcements?.data?.data.slice(0, 5),
      partners: partners?.data?.data,
      scheduleMatchs: filteredMatches.filter((match: ISchedules) => match.status === matchStatus.NOT_STARTED)
        .sort(
          (a: any, b: any) => new Date(a.matchedAt).getTime() - new Date(b.matchedAt).getTime()
        )
        .slice(0, 5) || [],
      matchResult: filteredMatches.filter((match: ISchedules) => (match.status === matchStatus.COMPLETED) && (match.squadMatchResults))
        .sort(
          (a: any, b: any) => new Date(a.matchedAt).getTime() - new Date(b.matchedAt).getTime()
        )
        .slice(0, 5) || [],
      rankingsData: rankingsData,
      ...(await serverSideTranslations(locale, ['langs'])),
      squads: squadArray,
    },
  }
}
