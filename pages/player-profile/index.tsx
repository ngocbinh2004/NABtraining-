import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import Title from "@/components/common/Title";
import Text from "@/atoms/Text";
import Select from "@/molecules/form/Select";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "@/molecules/media/Image";
import HorizontalTeamBlock from "../../ui/organisms/HorizontalTeamBlock";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import {
  getEventDetail,
  getEventRosterStatistics,
  getEvents,
  getMatches,
  getMatchStats,
  getRosterDetail,
  getSeasonDetails,
  getSquad,
} from "helpers/newApi";
import { IRoster as IRosterInfo } from "interfaces/roster_type";
import { ISchedules } from "interfaces/schedule_type";
import IEventRosterStatistics from "interfaces/event_roster_stats_type";
import { ISquad } from "interfaces/squad_detail_type";
import calculateAge from "helpers/calculateAge";
import IMatchStats from "interfaces/match_stats_type";
import { IRoster as IRosterMatch } from "interfaces/match_stats_type";
import { formatScheduleDateTime, getYearMonthDay } from "helpers/beautifyDate";
import { cx } from "class-variance-authority";
import { PlayerData, ProfileMatch } from "interfaces/player_profile_type";
import renderMatchActionStat from "@/components/player-profile/render_match_action_stat";
import { IApiEvent as IEvent } from "interfaces/event_type";
import { ISelectionSeason, ISeason } from "interfaces/season_type";
import renderTotalPoints from "@/components/player-profile/render_total_points";
import { VscWorkspaceUnknown } from "react-icons/vsc";

interface FilterChangeEvent {
  name: keyof FilterOptions;
  value: string | number;
}

interface FilterOptions {
  selectedYear: string;
  selectedEvent: string;
  selectedAction: string;
  selectedSquad: string;
}

interface PlayerProfileProps {
  playerData: PlayerData;
  matchData: ProfileMatch[];
  events: IEvent[];
  formattedSeasons: ISelectionSeason[];
  squads: ISquad[];
}

const PAGE_SIZE = 10;

export default function PlayerProfile({
  playerData,
  matchData,
  events,
  squads,
  formattedSeasons,
}: PlayerProfileProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    seasons: [] as { value: string, label: string }[],
    events: [] as { value: string, label: string }[],
    squads: [] as { value: string, label: string }[],
    actions: [] as { value: string, label: string }[],
    selectedSeason: "",
    selectedEvent: "",
    selectedSquad: "",
    selectedAction: "",
  });

  const extractSquadOptions = (
    data: ProfileMatch[]
  ) => {
    const squadNameMap = new Map<string, string>()

    data.forEach((match) => {
      if (match.homeTeam.id) {
        const id = match.homeTeam.id.toString()
        const squadName = match.homeTeam.name
        squadNameMap.set(id, squadName)
      }
      if (match.awayTeam.id) {
        const id = match.awayTeam.id.toString()
        const squadName = match.awayTeam.name
        squadNameMap.set(id, squadName)
      }
    })

    return Array.from(squadNameMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  // Initialize filter options
  useEffect(() => {
    const loadFilterOptions = async () => {

      const eventOptions = events.map((ev) => ({
        value: ev.id.toString(),
        label: ev.name
      }));

      const seasonOptions = formattedSeasons.map((ss) => ({
        value: ss.seasonId.toString(),
        label: ss.seasonYear
      }))

      const actionOptions =
        [
          {
            value: "attackPoints",
            label: t("PlayerProfile.attackPoints"),
          },
          {
            value: "blockPoints",
            label: t("PlayerProfile.blockPoints"),
          },
          {
            value: "servePoints",
            label: t("PlayerProfile.servePoints"),
          },
          {
            value: "passes",
            label: t("PlayerProfile.passes"),
          },
          {
            value: "defenses",
            label: t("PlayerProfile.defenses"),
          },
          {
            value: "sets",
            label: t("PlayerProfile.sets"),
          },
        ];

      // Extract filter options
      const squadOptions = extractSquadOptions(matchData);
      setFilterOptions((prev) => ({
        ...prev,
        seasons: seasonOptions,
        events: eventOptions,
        squads: squadOptions,
        actions: actionOptions,
        // At the moment, there is only one season and one event for each roster.  
        // This will be fixed later if, in the future, there is a way to get players (a player can have many rosters).
        selectedSeason: seasonOptions[0].value,
        selectedEvent: eventOptions[0].value,
        selectedSquad: "",
        selectedAction: actionOptions[0].value,

      }))
    }
    loadFilterOptions()
  }, [squads, events, formattedSeasons, matchData, t])

  //Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter data based on selections
  const filterMatches = (matches: ProfileMatch[]) => {
    return matches.filter((match) => {

      // Season filter
      if (filterOptions.selectedSeason) {
        const isInSeason = match.seasonId.toString() === filterOptions.selectedSeason
        if (!isInSeason) return false
      }

      // Event filter
      if (filterOptions.selectedEvent) {
        const isInEvent = match.eventId.toString() === filterOptions.selectedEvent
        if (!isInEvent) return false
      }

      // Squad filter
      if (filterOptions.selectedSquad) {
        const homeSquadId = match.homeTeam.id.toString()
        const awaySquadId = match.awayTeam.id.toString()
        if (
          homeSquadId !== filterOptions.selectedSquad &&
          awaySquadId !== filterOptions.selectedSquad
        ) {
          return false
        }
      }

      return true;
    });
  };

  const filteredMatches = filterMatches(matchData);

  const handleFilterChange = ({ name, value }: FilterChangeEvent) => {
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to translate position get by api
  const getPositionLabel = (position: string): string => {
    const map: Record<string, string> = {
      OutsideHitter: "outside_hitter",
      OppositeHitter: "opposite_hitter",
      MiddleBlocker: "middle_blocker",
      Setter: "setter",
      Libero: "libero",
    };

    const key = position ? map[position] : undefined;
    return key ? t(`PlayerRankingPage.position.${key}`) : "Unknown";
  };

  return (
    <div className="w-full">
      {/* Content inside container */}
      <div className="container mx-auto">
        <div
          className={cx(
            "flex flex-col md:flex-row mb-6 gap-4 lg:gap-[40px]",
            isMobile ? "items-center" : "items-start"
          )}
        >
          {/* Avatar Section */}
          <div className="relative w-[276px] h-[374px] overflow-visible flex-none mt-12">
            {/* Green background box - shifted down and right */}
            <div className="absolute w-[272px] h-[345px] bg-[#D4B686] right-[20px] top-[44px] z-0"></div>

            {/* Avatar image */}
            <div className="relative z-10 w-full h-full">
              <Image
                url={playerData.imageUrl}
                alt="Player Image"
                classNames="w-full h-full object-cover rounded"
                width={276}
                height={374}
                quality={100}
              />
            </div>
          </div>

          {/* Title and Profile Info Section */}
          <div className="w-full mt-8">
            {/* Title */}
            <div className="w-full mb-6">
              <div className="flex items-center">
                <Title
                  title_text={t("PlayerProfile.title")}
                  fallback="Player Profile & Stats"
                  isMobile={isMobile}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="w-full border boxBlurShadow p-6 lg:py-[24px] lg:px-[64px] text-white">
              <div className="flex flex-col gap-[24px]">
                
                <div className="items-center flex flex-row justify-between">
                  <div className="text-[18px] md:text-[28px] leading-[1.3] flex flex-wrap items-center gap-x-3">
                    {playerData.name}
                    <span className="flex items-center whitespace-nowrap">
                      <span className="w-[1px] h-[14px] md:h-[20px] bg-white rotate-[10deg] opacity-100"></span>
                      <span className="ml-3">#{playerData.jerseyNumber}</span>
                    </span>
                  </div>
                  <div className="gap-2 flex flex-row items-center justify-end ml-2">
                    <div>
                      {playerData.squadLogo !== "Logo Unknown" ? 
                        (
                          <Image
                            url={playerData.squadLogo}
                            alt="squadLogo"
                            width={isMobile ? 22 : 45}
                            height={isMobile ? 21 : 43}
                          />
                        ):(
                        <VscWorkspaceUnknown className="text-[#009465]" size={isMobile ? 22 : 44} />
                        )
                      }
                    </div>
                    <div className="text-[16px] md:text-[24px] leading-[1.3]">{playerData.squadName}</div>
                  </div>
                </div>

                <div className="border-b border-[#FFFFFF]"></div>

                <div className="grid grid-cols-[150px,1fr] gap-y-3 gap-x-2 sm:text-[20px] text-[16px]">
                  <span>{t("PlayerProfile.position")}</span>
                  <span>{getPositionLabel(playerData.position)}</span>

                  <span>{t("PlayerProfile.age")}</span>
                  <span>{playerData.age}</span>

                  <span>{t("PlayerProfile.dob")}</span>
                  <span>{playerData.birthdate}</span>

                  <span>{t("PlayerProfile.school")}</span>
                  <span>{playerData.school}</span>

                  <span>{t("PlayerProfile.experience")}</span>
                  <span>{playerData.experience}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-white py-6 mb-6 bg-[#004F36]">
        <div className="container mx-auto">
          <div className="text-center mb-2">
            <div className="flex items-center w-full my-2">
              <div className="flex-1 border-t border-white"></div>
              <div className="flex items-center">
                <Image
                  url="/assets/yellow_star.png"
                  alt="Star"
                  width={25}
                  height={29}
                  classNames="mx-4"
                />
                <div className="flex items-center justify-start">
                  <span className="font-semibold text-white text-[20px] text-center my-2 text-nowrap">
                    {t("PlayerProfile.careerStats")}
                  </span>
                </div>
                <Image
                  url="/assets/yellow_star.png"
                  alt="Star"
                  width={25}
                  height={29}
                  classNames="mx-4"
                />
              </div>
              <div className="flex-1 border-t border-white"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 justify-items-center ml-0">
            <div className="flex flex-col items-center justify-center">
              <Text classNames="text-xxs">
                {t("PlayerProfile.attackPoints")}
              </Text>
              <div className="flex items-baseline gap-1 mt-4 mb-4">
                <span className="text-[40px] font-bold italic">
                  {playerData.attackPoints}
                </span>
                <span className="text-base">
                  {t("PlayerProfile.pointsUnit")}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Text classNames="text-xxs">
                {t("PlayerProfile.blockPoints")}
              </Text>
              <div className="flex items-baseline gap-1 mt-4 mb-4">
                <span className="text-[40px] font-bold italic">
                  {playerData.blockPoints}
                </span>
                <span className="text-base">
                  {t("PlayerProfile.pointsUnit")}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Text classNames="text-xxs">
                {t("PlayerProfile.servePoints")}
              </Text>
              <div className="flex items-baseline gap-1 mt-4 mb-4">
                <span className="text-[40px] font-bold italic">
                  {playerData.servePoints}
                </span>
                <span className="text-base">
                  {t("PlayerProfile.pointsUnit")}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Text classNames="text-xxs">{t("PlayerProfile.passes")}</Text>
              <div className="flex items-baseline gap-1 mt-4 mb-4">
                <span className="text-[40px] font-bold italic">
                  {playerData.passes}
                </span>
                <span className="text-base">
                  {t("PlayerProfile.timesUnit")}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Text classNames="text-xxs">{t("PlayerProfile.defenses")}</Text>
              <div className="flex items-baseline gap-1 mt-4 mb-4">
                <span className="text-[40px] font-bold italic">
                  {playerData.defenses}
                </span>
                <span className="text-base">
                  {t("PlayerProfile.timesUnit")}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Text classNames="text-xxs">{t("PlayerProfile.sets")}</Text>
              <div className="flex items-baseline gap-1 mt-4 mb-4">
                <span className="text-[40px] font-bold italic">
                  {playerData.sets}
                </span>
                <span className="text-base">
                  {t("PlayerProfile.timesUnit")}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center col-span-2 sm:col-span-1">
              <Text classNames="text-xxs">
                {t("PlayerProfile.totalPoints")}
              </Text>
              <div className="flex items-baseline gap-1 mt-4 mb-4">
                <span className="text-[40px] font-bold italic">
                  {playerData.totalPoints}
                </span>
                <span className="text-base">
                  {t("PlayerProfile.pointsUnit")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mb-6">
        <div className="border-2 border-gray-270 text-white">
          <div className="grid grid-cols-4 gap-4 bg-black p-4 lg:py-[32px] lg:px-[64px] items-center">
            {/* Season Select */}
            <div className={`${isMobile ? "col-span-2" : "col-span-1"}`}>
              <Select
                name="season"
                selectedOption={filterOptions.selectedSeason}
                options={[
                  ...filterOptions.seasons
                ]}
                classNames="w-full border p-1"
                onChange={(value) =>
                  handleFilterChange({ name: "selectedYear", value })
                }
              />
            </div>

            {/* event Select */}
            <div className={`${isMobile ? "col-span-2" : "col-span-1"}`}>
              <Select
                name="event"
                selectedOption={filterOptions.selectedEvent}
                options={[
                  ...filterOptions.events
                ]}
                classNames="w-full border p-1"
                onChange={(value) =>
                  handleFilterChange({ name: "selectedEvent", value })
                }
              />
            </div>

            {/* team Select */}
            <div className={`${isMobile ? "col-span-4" : "col-span-1"}`}>
              <Select
                name="squad"
                selectedOption={filterOptions.selectedSquad}
                options={[
                  {
                    value: "",
                    label: t("PlayerProfile.squadPlaceHolder")
                  },
                  ...filterOptions.squads
                ]}
                classNames="w-full border p-1"
                placeholder={t("PlayerProfile.squadPlaceHolder")}
                onChange={(value) =>
                  handleFilterChange({ name: "selectedSquad", value })
                }
              />
            </div>

            {/* action Select */}
            <div className={`${isMobile ? "col-span-4" : "col-span-1"}`}>
              <Select
                name="action"
                selectedOption={filterOptions.selectedAction}
                options={[
                  ...filterOptions.actions
                ]}
                classNames="w-full border p-1"
                onChange={(value) =>
                  handleFilterChange({ name: "selectedAction", value })
                }
              />
            </div>
          </div>

          <div className="border-t-2 border-white"></div>

          {(filteredMatches.length === 0) ? (
            // Coming soon
            <div className="mb-4 w-full lg:px-[64px] p-4 lg:py-8">
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
            <div className="sm:px-[64px] px-[15px] py-4 space-y-6 flex flex-col">
              <div>
                {filteredMatches.map((match, idx) => (
                  <div
                    key={match.id}
                    className={`pb-4 border-b border-white mt-2`}
                  >
                    <div
                      className={`flex items-center flex-wrap text-[12px] sm:text-[16px] text-white space-x-2 mb-2 ${isMobile && "justify-center"
                        }`}
                    >
                      <span className="font-bold ">{match.gameCode}</span>
                      <Image
                        url="/assets/yellow_star.png"
                        alt="Star"
                        width={20}
                        height={20}
                      />
                      <span>{match.venue}</span>
                      <span>{formatScheduleDateTime(match.matchedAt, t).datePart}</span>
                    </div>

                    {!isMobile ? (
                      // Desktop Layout
                      <div className="flex flex-wrap md:flex-row justify-between items-center text-xl lg:gap-y-6 gap-y-2 w-full">
                        {/* Row 1: Home team - Score - Away team */}
                        <div className="flex flex-row gap-2 lg:gap-[20px] min-w-[500px] lg:w-[65%]">
                          <div className="flex items-center">
                            <HorizontalTeamBlock
                              team={match.homeTeam}
                              typeLabel={"所屬"}
                              isMobile={isMobile}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-2 lg:gap-4 text-white text-[20px] font-bold">
                            <span>{match.homeScore}</span>
                            <span>:</span>
                            <span>{match.awayScore}</span>
                          </div>
                          <div className="flex items-center">
                            <HorizontalTeamBlock
                              team={match.awayTeam}
                              typeLabel={"對戰"}
                              isMobile={isMobile}
                            />
                          </div>
                        </div>
                        {/* Row 2: Action - Success Rate */}
                        <div className="lg:w-[35%] ml-auto">
                          {renderMatchActionStat(
                            filterOptions.selectedAction,
                            match,
                            t,
                            isMobile,
                          )}
                        </div>
                      </div>
                    ) : (
                      // Mobile Layout
                      <div
                        className={`flex flex-col gap-y-4 text-xl ${isMobile && "justify-center"
                          }`}
                      >
                        {/* Row 1: Home - Score - Away */}
                        <div className="grid grid-cols-3 items-center">
                          <div className="flex flex-col items-center">
                            <HorizontalTeamBlock
                              team={match.homeTeam}
                              typeLabel={"所屬"}
                              isMobile={isMobile}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-[16px] text-white text-[32px] font-bold">
                            <span>{match.homeScore}</span>
                            <span>:</span>
                            <span>{match.awayScore}</span>
                          </div>
                          <HorizontalTeamBlock
                            team={match.awayTeam}
                            typeLabel={"對戰"}
                            isMobile={isMobile}
                          />
                        </div>

                        {/* Row 2: Attack - Success Rate */}
                        {renderMatchActionStat(
                          filterOptions.selectedAction,
                          match,
                          t,
                          isMobile,
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Show total action points */}
              <div className="ml-auto w-full">
                {renderTotalPoints(filterOptions.selectedAction, filteredMatches, t, isMobile)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { res, query, locale } = context;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=3600"
  );

  // Validate the required parameters
  const isValid = (value: unknown): boolean => {
    return (
      value !== null &&
      value !== undefined &&
      (typeof value === "number" ||
        (typeof value === "string" && /^\d+$/.test(value)))
    );
  };

  const leagueId = process.env.NEXT_CUSTOMER_LEAGUE_ID as string;
  const rosterId = query?.rosterId as string;

  if (!isValid(leagueId) || !isValid(rosterId)) {
    return { notFound: true } as const;
  }

  const roster = (await getRosterDetail(rosterId))?.data?.data as IRosterInfo;
  if (!roster) {
    return { notFound: true } as const;
  }

  // The stats data response is an array containing a single object
  const [stats, event]: [IEventRosterStatistics[], IEvent] = await Promise.all([
    getEventRosterStatistics(roster.eventId, roster.id).then(
      (res) => res?.data?.data ?? null
    ),
    getEventDetail(roster.eventId).then((res) => res?.data?.data ?? null),
  ]);

  const events: IEvent[] = [];
  events.push(event);

  const [squads, season, matches]: [ISquad[], ISeason, ISchedules[]] =
    await Promise.all([
      getSquad(event.id).then((res) => res?.data?.data ?? []),
      getSeasonDetails(event.seasonId || "").then(
        (res) => res?.data?.data ?? null
      ),
      getMatches(`?leagueId=${leagueId}&eventId=${event.id}`).then(
        (res) => res?.data?.data ?? []
      ),
    ]);

  const squadsMap = squads.reduce((acc, squad) => {
    acc.set(squad.id, squad);
    return acc;
  }, new Map<number, ISquad>());

  const getFormatSeason = (season: ISeason) => {
    const startYear = new Date(season.startTime).getFullYear();
    const endYear = new Date(season.endTime).getFullYear();
    return {
      seasonId: season.id,
      seasonYear: `${startYear}-${String(endYear).slice(-2)}`,
    };
  };

  const formattedSeasons: ISelectionSeason[] = [];
  formattedSeasons.push(getFormatSeason(season));

  const matchListFilter = matches
    .filter((match: ISchedules) => {
      const hasResult = match.squadMatchResults;
      const hasRosterSquad = match.awaySquadId === roster.squadId || match.homeSquadId === roster.squadId;
      return hasResult && hasRosterSquad
    })
    .sort((a, b) => {
      if (!a.matchedAt && !b.matchedAt) return 0;
      if (!a.matchedAt) return 1;
      if (!b.matchedAt) return -1;

      return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime();
    });

  const matchData: ProfileMatch[] = await Promise.all(
    matchListFilter.map(async (match: ISchedules) => {
      const res = await getMatchStats(match.id);
      const data = res?.data?.data as IMatchStats;
      const rosterMatchStats =
        data.rosters.find(
          (roster: IRosterMatch) => roster.rosterId.toString() === rosterId
        ) || null;
      const squadMatchResults = match.squadMatchResults;
      const homeSquadResult = squadMatchResults.find((m) => {
        return m.squadId === match.homeSquadId;
      });
      const ProfileMatch: ProfileMatch = {
        id: match.id,
        seasonId: match.seasonId,
        eventId: match.eventId,
        matchedAt: match.matchedAt,
        gameCode: match.code,
        venue: match.venue,
        homeTeam: squadsMap.get(match.homeSquadId) as ISquad,
        awayTeam: squadsMap.get(match.awaySquadId) as ISquad,
        homeScore: homeSquadResult?.wonRounds || 0,
        awayScore: homeSquadResult?.lostRounds || 0,
        attack: {
          success: rosterMatchStats?.completedSpikes || 0,
          attackTotal: rosterMatchStats?.spikes || 0,
          successRate: rosterMatchStats?.spikesMetrics.successPercentage || 0,
        },
        block: {
          success: rosterMatchStats?.completedBlocks || 0,
          attackTotal: rosterMatchStats?.blocks || 0,
          successRate: rosterMatchStats?.blocksMetrics.successPercentage || 0,
        },
        serve: {
          success: rosterMatchStats?.completedServes || 0,
          attackTotal: rosterMatchStats?.serves || 0,
          successRate: rosterMatchStats?.servesMetrics.successPercentage || 0,
        },
        pass: {
          success: rosterMatchStats?.completedPasses || 0,
          attackTotal: rosterMatchStats?.passes || 0,
          successRate: rosterMatchStats?.passesMetrics.successPercentage || 0,
        },
        defense: {
          success: rosterMatchStats?.completedDefenses || 0,
          attackTotal: rosterMatchStats?.defenses || 0,
          successRate: rosterMatchStats?.defensesMetrics.successPercentage || 0,
        },
        set: {
          success: rosterMatchStats?.completedSets || 0,
          attackTotal: rosterMatchStats?.sets || 0,
          successRate: rosterMatchStats?.setsMetrics.successPercentage || 0,
        },
      };
      return ProfileMatch;
    })
  );

  const playerData: PlayerData = {
    name: roster.personalInfo.name,
    position: roster.position,
    age: calculateAge(roster.personalInfo.birth) || 0,
    birthdate: getYearMonthDay(roster.personalInfo.birth) || "Unknown",
    school: "Unknown", // Placeholder, as school is not provided in the data
    experience: "Unknown", // Placeholder, as experience is not provided in the data
    squadName: squadsMap.get(roster.squadId)?.name || "Unknown",
    squadLogo: squadsMap.get(roster.squadId)?.logoUrl || "Logo Unknown",
    jerseyNumber: roster.jerseyNumber || "Unknown",
    imageUrl: roster.personalInfo.avatarUrl || "/assets/no-image-available.png",
    attackPoints: stats?.[0].completedSpikes || 0,
    blockPoints: stats?.[0].completedBlocks || 0,
    servePoints: stats?.[0].completedServes || 0,
    passes: stats?.[0].completedPasses || 0,
    defenses: stats?.[0].completedDefenses || 0,
    sets: stats?.[0].completedSets || 0,
    totalPoints: stats?.[0].score || 0,
  };

  return {
    props: {
      events,
      squads,
      formattedSeasons,
      playerData,
      matchData,
      ...(await serverSideTranslations(locale || "en", ["langs"])),
    },
  };
};
