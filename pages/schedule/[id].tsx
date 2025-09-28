import { NextApiResponse } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { cx } from "class-variance-authority"
import { useTranslation } from "next-i18next"
//helpers
import { getMatches, getSquadDetail, getRoster, getMatchStats } from "helpers/newApi"
import { getHomeAwayTeamData } from "helpers/getTeamData"
//components
import { ISchedules } from "interfaces/schedule_type"
import { Teams } from "interfaces/team_type"
import { Image } from "@/molecules/media/Image"
import LinkText from "@/molecules/LinkText"
import ScheduleResult from "@/organisms/card/schedule/ScheduleResult"
import GameStats from "@/components/table/GameStats"
import PlayerStatsTable from "@/components/table/PlayerStats"
import { RiArrowRightSLine } from "react-icons/ri"
import { ISquad } from "interfaces/squad_detail_type"
import IMatchStats from "interfaces/match_stats_type"
import { IRoster } from "interfaces/roster_type"
import { VscWorkspaceUnknown } from "react-icons/vsc"

interface Props {
  schedule: ISchedules
  homeTeamData: ISquad
  awayTeamData: ISquad
  homeRoster: IRoster[]
  awayRoster: IRoster[]
  matchStats: IMatchStats
}

export default function CompetitionData({
  schedule,
  homeTeamData,
  awayTeamData,
  homeRoster,
  awayRoster,
  matchStats,
}: Props) {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [fullDisplay, setFullDisplay] = useState(true)
  const [activeTab, setActiveTab] = useState(false)
  const tabs = [
    { id: "away", label: t("Schedule.away"), isActive: !activeTab },
    { id: "home", label: t("Schedule.home"), isActive: activeTab }
  ]
  const squadsMap = useMemo(() => {
    const map = new Map<number, ISquad>();
    map.set(homeTeamData.id, homeTeamData);
    map.set(awayTeamData.id, awayTeamData);
    return map;
  }, [homeTeamData, awayTeamData]);

  const handleTabClick = (tabId: string) => setActiveTab(tabId === "home")

  // prepare GameStats data
  const teamData = getHomeAwayTeamData(schedule, homeTeamData, awayTeamData, matchStats)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setFullDisplay(false);
    } else setFullDisplay(true);
  }, [isMobile]);

  const [selectedTeam, setSelectedTeam] = useState<ISquad | null>(null);
  useEffect(() => {
    setSelectedTeam(activeTab ? homeTeamData : awayTeamData);
  }, [activeTab, homeTeamData, awayTeamData]);

  return (
    <div className="wl-home">
      <div className="container mx-auto mt-5">
        {/* Title & Datasheet link */}
        <div className="flex flex-row justify-between items-center my-4">
          <div className="flex items-center justify-center">
            <Image
              url="/assets/yellow_star.png"
              alt="Yellow Star"
              classNames="w-7 h-7 lg:w-8 lg:h-8 mr-2"
            />
            <p className="w-full text-left text-white text-2xl lg:text-[32px] font-bold">
              {homeTeamData?.name} vs {awayTeamData?.name}
            </p>
          </div>
          <LinkText
            href="/coming-soon"
            size="body2"
            classNames="text-white font-medium flex whitespace-nowrap items-center text-base lg:text-lg"
          >
            {t("Schedule.CompetitionData.datasheet")}
            <RiArrowRightSLine size={24} className="ml-1 text-white" />
          </LinkText>
        </div>

        {/* Schedule result & game stats */}
        <ScheduleResult resultMatchData={schedule} fullDisplay={fullDisplay} isBorder={true} showWinnerBadge={false} 
          showActionButtons={false} squadsMap={squadsMap}
        />
        <GameStats teamData={teamData} />

        {/* Tabs */}
        <div className="flex w-full mb-6 mt-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-8 py-3 font-medium w-full text-base ${tab.isActive
                ? "bg-[#009919] text-white"
                : "bg-white text-gray-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Team name & image */}
        <div className="flex items-center w-full my-4">
          <div className="flex-1 border-t border-white"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-start">
              {selectedTeam?.logoUrl ? (
                <Image
                  url={selectedTeam.logoUrl}
                  alt={selectedTeam.name}
                  classNames="h-8 w-8 mr-3 min-h-8 min-w-8 ml-6"
                  imageClassNames="h-full w-full"
                  objectFit="cover"
                  quality={100}
                />
              ) : (
                <VscWorkspaceUnknown
                  className="text-[#009465] ml-6 mr-3"
                  size={isMobile ? 40 : 64}
                />
              )}
              <span className={cx(
                "font-semibold text-white text-center my-5 text-nowrap mr-6",
                isMobile ? "text-[20px]" : "text-[24px]"
              )}>
                {activeTab ? homeTeamData?.name : awayTeamData?.name}
              </span>
            </div>
          </div>
          <div className="flex-1 border-t border-white"></div>
        </div>

        {/* Player stats */}
        <PlayerStatsTable rostersInfo={activeTab ? homeRoster : awayRoster} rostersMatchStats={matchStats.rosters}/>
      </div>
    </div>
  )
}

// SSR to fetch data
export async function getServerSideProps({
  query,
  res,
  locale
}: {
  query?: { [key: string]: string }
  res: NextApiResponse
  locale: string
}) {
  const leagueId = process.env.NEXT_CUSTOMER_LEAGUE_ID 
  const matchId = query?.id
  if(!matchId || !leagueId) 
    return { notFound: true } as const
  
  let matchData: ISchedules | null = null;
  try {
    const matchRes = await getMatches(`/${matchId}`);
    matchData = matchRes?.data?.data;

    if (
      !matchData ||
      matchData.sportName !== 'Volleyball' ||
      matchData.squadMatchResults === null ||
      matchData.leagueId.toString() !== leagueId
      ) { throw new Error('Invalid match data'); }
  } catch (error) {
    console.error('Error fetching match data:', error);
    return { notFound: true } as const
  }



  const homeTeamId = matchData.homeSquadId
  const awayTeamId = matchData.awaySquadId

  const [homeTeamData, awayTeamData, homeRoster, awayRoster, matchStats] = await Promise.all([
    getSquadDetail(homeTeamId).then(res => res?.data?.data),
    getSquadDetail(awayTeamId).then(res => res?.data?.data),
    getRoster(homeTeamId).then(res => res?.data?.data),
    getRoster(awayTeamId).then(res => res?.data?.data),
    getMatchStats(matchId).then(res => res?.data?.data)
  ])

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  )
  return {
    props: {
      schedule: matchData,
      homeTeamData: homeTeamData,
      awayTeamData: awayTeamData,
      homeRoster: homeRoster,
      awayRoster: awayRoster,
      matchStats: matchStats as IMatchStats,
      ...(await serverSideTranslations(locale, ["langs"]))
    }
  }
}
