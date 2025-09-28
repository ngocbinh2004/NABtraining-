import { useTranslation } from 'next-i18next'
import { useEffect, useState, useCallback, useRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { cx } from 'class-variance-authority'
// Components
import TeamRanking from '@/components/table/TeamRanking'
import BattleRanking from '@/components/table/BattleRanking'
import YearPicker from '@/components/year-picker/YearPicker'
// UI
import Icon from '@/atoms/Icon'
// Helpers
import { getEvent, getLeagueRecord } from 'helpers/api'
// Interfaces
import { ILeagueRankingType } from 'interfaces/league_ranking_type'
import { ITeamRecordType } from 'interfaces/team_record_type'
import Title from '@/components/common/Title'
import { GetServerSideProps } from 'next'
import { getEventDetail, getEvents, getMatches, getMatchStats, getSeasonDetails, getSeasons, getSquad, getSquadDetail } from 'helpers/newApi'
import { ISelectionSeason, ISeason } from 'interfaces/season_type'
import { ISquad } from 'interfaces/squad_detail_type'
import { ISchedules } from 'interfaces/schedule_type'
import IMatchStats from 'interfaces/match_stats_type'
import { ISquad as squadMatchStats } from 'interfaces/match_stats_type'
import createTeamRecord from 'helpers/createTeamRecord'
import { IApiEvent } from 'interfaces/event_type'
import IBattleData, { IRecord } from 'interfaces/battle_data_type'
import createBattleData from 'helpers/createBattleData'
import { useRouter } from 'next/router'

export default function Record({ 
  rankingsData, 
  yearList, 
  battlesData,
}: { 
  rankingsData: ILeagueRankingType, 
  yearList: number[],
  battlesData: IBattleData[],
}) {
  const { t } = useTranslation()
  const minYear = Math.min(...yearList);
  const maxYear = Math.max(...yearList);
  const [rankingState, setRankingState] = useState('team')
  const [currentYear, setCurrentYear] = useState(rankingsData.year)
  const indexYear = yearList.indexOf(currentYear)
  const [currentTeamData, setCurrentTeamData] = useState<ITeamRecordType[]>(rankingsData.teams_record)
  const [battleData, setBattleData] = useState(battlesData)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const [clicked, setClicked] = useState(false)
  const recordTitle = currentYear ? (currentYear + "-" + (currentYear + 1).toString().slice(2, 4)) : "";

  //show glow effect when the tables is overflow
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showRightFade, setShowRightFade] = useState(false)
  const [showLeftFade, setShowLeftFade] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const updateFade = () => {
      const { scrollLeft, clientWidth, scrollWidth } = el
      const canScroll = scrollWidth > clientWidth
      const isEnd = scrollLeft + clientWidth >= scrollWidth - 1
      const isStart = scrollLeft <= 1
      setShowRightFade(canScroll && !isEnd)
      setShowLeftFade(canScroll && !isStart)
    }
    // Wait for the layout render data
    setTimeout(updateFade, 0)
    el.addEventListener("scroll", updateFade)
    window.addEventListener("resize", updateFade)
    return () => {
      el.removeEventListener("scroll", updateFade)
      window.removeEventListener("resize", updateFade)
    }
  }, [rankingState])

  const handleYearChange = (type: string) => {
    setClicked(true);
    let newIndex = indexYear;

    //yearList sorted desc
    if (type === 'prev') {
      newIndex = Math.min(yearList.length - 1, indexYear + 1);
    } else if (type === 'next') {
      newIndex = Math.max(0, indexYear - 1);
    }

    const newYear = yearList[newIndex];
    setCurrentYear(newYear);
    router.push(`/record?year=${newYear}`);
  };

  const handleSetData = useCallback(() => 
    {
      if (rankingState === 'team') {
        if (rankingsData?.teams_record && rankingsData.teams_record.length > 0) {
          setCurrentTeamData(rankingsData.teams_record)
        }
      }

      if (rankingState === 'battle') {
        setBattleData(battleData)
      }
    },
    [rankingsData, rankingState, battleData]
  )

  //Reset click when the data is loaded
  useEffect(() => {
    setClicked(false);
  }, [currentTeamData, battleData]);

  useEffect(() => {
    setCurrentTeamData([])
    handleSetData()
  }, [handleSetData])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container mx-auto mt-12 w-full">
      <div className="flex items-center gap-2">
        <Title
          title_text= {`${recordTitle} ${t('Record.record')}`.trim()}
          fallback='Team Statistics'
          isMobile={isMobile} 
        />
      </div>

      <div className="w-full mt-6 bg-white h-12 flex">
        <button
          className={cx(
            'basis-1/2 font-normal hover:bg-[#33cc4d] hover:text-white text-base',
            rankingState === 'team'
              ? 'bg-[#009919] text-white'
              : 'text-gray-600 bg-white'
          )}
          onClick={() => setRankingState('team')}
        >
          {t('Record.team_ranking')}
        </button>
        <button
          className={cx(
            'basis-1/2 font-normal hover:bg-[#33cc4d] hover:text-white text-base',
            rankingState === 'battle'
              ? 'bg-[#009919] text-white'
              : 'text-gray-600 bg-white'
          )}
          onClick={() => setRankingState('battle')}
        >
          {t('Record.battle_ranking')}
        </button>
      </div>

      <div className="w-full mt-8 border border-b-0 border-white boxBlurShadow relative">
        <div ref={scrollRef} className="overflow-auto">
          {rankingState === 'team' && <TeamRanking key={currentYear} teamData={currentTeamData}/>}
          {rankingState === 'battle' && <BattleRanking battleData={battlesData}/>}
        </div>
        {showLeftFade && (
          <div className="pointer-events-none absolute top-0 left-0 h-full w-[80px] bg-gradient-to-l from-black/0 to-black/100 transition-opacity" />
        )}
        {showRightFade && (
          <div className="pointer-events-none absolute top-0 right-0 h-full w-[80px] bg-gradient-to-r from-black/0 to-black/100 transition-opacity" />
        )}
      </div>

      {/* <YearPicker
        currentYear={currentYear}
        minYear={minYear}
        maxYear={maxYear}
        handleYearChange={handleYearChange}
        disabled={clicked}
      /> */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { res, query, locale } = context;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=3600"
  );

  // Validate the year parameter if it exists.
  function isValidYearString(yearStr: string): boolean {
    if(yearStr){
      const year = Number(yearStr);
      return /^\d{4}$/.test(yearStr) && year >= 1900 && year <= 2100;
    }
    return true
  }

  const year = query?.year as string;
  const leagueId = process.env.NEXT_CUSTOMER_LEAGUE_ID as string;

  if (!leagueId || !isValidYearString(year))
  {
    return { notFound: true } as const;
  }


  const seasonList: ISeason[] = (await getSeasons(leagueId))?.data?.data || [];
  if (!seasonList.length){
    return { notFound: true } as const;
  } 
  //sort season time newest to oldest
  seasonList.sort((a, b) => {
    const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
    const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
    return dateB - dateA;
  });
  const yearList = seasonList.map(ss => (new Date(ss.startTime)).getFullYear())

  const minYear = Math.max((new Date(seasonList[seasonList.length-1].endTime)).getFullYear())
  const maxYear = Math.min((new Date(seasonList[0].startTime)).getFullYear())
  // Return if the year is out of the seasons range.
  if(year){
    if ((Number(year)<minYear) || Number(year)>maxYear){
      return { notFound: true } as const;
    }
  }

  //If there isn't year in the param then use the lastest season
  let season: ISeason
  if (year){
    season = seasonList.find(s => (new Date(s.startTime)).getFullYear() === Number(year)) as ISeason;
  }
  else{
    season = seasonList[0];
  }

  //Since the Figma design assumes one event per season, I only fetch the latest event of the season from the API.
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

  //init record for battle data
  const recordArr: IRecord[] = []
  squads.forEach(sq => {
    recordArr.push({
      opponent: sq.name,
      opponentId: sq.id,
      result: "-"
    })
  })

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
  const BattleDataList: IBattleData[] = [];
  for (const squad of squads){
    const matchStatsArr: squadMatchStats[] = squadStatsMap.get(squad.id) || [];
  
    const teamRecord: ITeamRecordType = createTeamRecord(matchStatsArr, squad, squads.length);
    squadRecordList.push(teamRecord);
    const battleData: IBattleData = createBattleData(matchStatsArr, squad, matchMap, recordArr);

    BattleDataList.push(battleData);
  }
  squadRecordList.sort((a, b) => b.points - a.points)


  const rankingsData: ILeagueRankingType = {
    teams_record: squadRecordList,
    seasonId: season.id,
    eventId: lastestEvent.id,
    year: new Date(season.startTime).getFullYear(),
    eventName: lastestEvent.name
  }


  return {
    props: {
      rankingsData: rankingsData,
      yearList: yearList,
      battlesData: BattleDataList,
      ...(await serverSideTranslations(locale || "en", ["langs"])),
    },
  }
}