import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/router"
import { cx } from "class-variance-authority"

//ui
import Text from "@/atoms/Text"
import Image from "@/molecules/media/Image"
import Line from "@/atoms/Line"
import Select from "@/molecules/form/Select"
//constants
import { ISchedules } from "interfaces/schedule_type"
import ScheduleMatch from "@/organisms/card/schedule/ScheduleMatch"
import ScheduleResult from "@/organisms/card/schedule/ScheduleResult"
import { matchStatus } from "constants/gameStatus"
import { getMatches, getSquad, getTeam } from "helpers/newApi"
import Pagination from "@/molecules/Pagination"
import Title from "@/components/common/Title"
import { ISquad } from "interfaces/squad_detail_type"

const leagueId = process.env.NEXT_CUSTOMER_LEAGUE_ID
const PAGE_SIZE = 10
interface IProps {
  resultMatchData?: {
    data?: ISchedules[]
    total: number
  }
  incomingMatch?: {
    data?: ISchedules[]
    total: number
  }
  futurePage: number
  resultPage: number
  squads: ISquad[]
}

const teamNameCache = new Map<string, string>()

export default function Schedule({
  incomingMatch,
  resultMatchData,
  futurePage,
  resultPage,
  squads
}: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [homeSquad, setHomeSquad] = useState<null>(null)
  const [awaySquad, setAwaySquad] = useState<null>(null)
  const [isNewestToOldest, setIsNewestToOldest] = useState(true)
  const [filterOptions, setFilterOptions] = useState({
    years: [] as string[],
    months: [] as { value: string; label: string }[],
    teams: [] as { value: string; label: string }[],
    selectedYear: "",
    selectedMonth: "",
    selectedTeam: ""
  })

  const squadsMap = useMemo(() => {
    return new Map<number, ISquad>(
      (squads ?? []).map(squad => [squad.id, squad])
    )
  }, [squads])

  const handlePaginationChange = (nextPage: number) => {
    const query = { ...router.query }

    if (activeTab) {
      query.resultPage = nextPage.toString()
    } else {
      query.futurePage = nextPage.toString()
    }

    router.push({
      pathname: router.pathname,
      query
    })
  }

  const fetchTeamName = useCallback(async (teamId: string): Promise<string> => {
    const cachedName = teamNameCache.get(teamId)
    if (cachedName !== undefined) return cachedName

    try {
      const response = await getTeam(teamId)
      const name = response?.data?.data?.name || teamId
      teamNameCache.set(teamId, name)
      return name
    } catch (error) {
      console.error("Error fetching team name:", error)
      return teamId
    }
  }, [])

  const extractFilterOptions = (
    data: ISchedules[],
    idToNameMap: Map<string, string>
  ) => {
    const years = new Set<string>()
    const months = new Set<string>()
    const teamMap = new Map<string, string>()

    data.forEach((match) => {
      if (match.matchedAt) {
        const date = new Date(match.matchedAt)
        years.add(date.getFullYear().toString())
        const month = date.getMonth() + 1
        months.add(
          `${month}-${new Date(0, month - 1).toLocaleString("default", {
            month: "long"
          })}`
        )
      }
      if (match.homeSquadId) {
        const id = match.homeSquadId.toString()
        teamMap.set(id, idToNameMap.get(id) || id)
      }
      if (match.awaySquadId) {
        const id = match.awaySquadId.toString()
        teamMap.set(id, idToNameMap.get(id) || id)
      }
    })

    return {
      years: Array.from(years).sort(),
      months: Array.from(months)
        .sort((a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]))
        .map((m) => {
          const [value, label] = m.split("-")
          return { value, label }
        }),
      teams: Array.from(teamMap.entries())
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label))
    }
  }

  // Initialize filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      const allMatches = [
        ...(incomingMatch?.data ?? []),
        ...(resultMatchData?.data ?? [])
      ]

      // Collect unique team IDs
      const uniqueTeamIds = new Set<string>()
      allMatches.forEach((match) => {
        if (match.homeSquadId) uniqueTeamIds.add(match.homeSquadId.toString())
        if (match.awaySquadId) uniqueTeamIds.add(match.awaySquadId.toString())
      })

      // Fetch team names
      const entries = await Promise.all(
        Array.from(uniqueTeamIds).map(async (teamId) => {
          const name = await fetchTeamName(teamId)
          return [teamId, name] as [string, string]
        })
      )
      const idToNameMap = new Map(entries)

      // Extract filter options
      const options = extractFilterOptions(allMatches, idToNameMap)
      setFilterOptions((prev) => ({
        ...prev,
        years: options.years,
        months: options.months,
        teams: options.teams,
        selectedYear: "",
        selectedMonth: "",
        selectedTeam: ""
      }))
    }

    loadFilterOptions()
  }, [incomingMatch?.data, resultMatchData?.data, fetchTeamName])
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Sort data
  const sortMatches = (matches: ISchedules[]) => {
    return [...matches].sort((a, b) => {
      const timeA = new Date(a.matchedAt ?? 0).getTime()
      const timeB = new Date(b.matchedAt ?? 0).getTime()
      return isNewestToOldest ? timeA - timeB : timeB - timeA
    })
  }
  const sortedIncomingMatches = sortMatches(incomingMatch?.data ?? [])
  const sortedResultMatches = sortMatches(resultMatchData?.data ?? [])
  // Filter data based on selections
  const filterMatches = (matches: ISchedules[]) => {
    return matches.filter((match) => {
      // Year filter
      if (filterOptions.selectedYear && match.matchedAt) {
        const matchYear = new Date(match.matchedAt).getFullYear().toString()
        if (matchYear !== filterOptions.selectedYear) return false
      }

      // Month filter
      if (filterOptions.selectedMonth && match.matchedAt) {
        const matchMonth = (new Date(match.matchedAt).getMonth() + 1).toString()
        if (matchMonth !== filterOptions.selectedMonth) return false
      }

      // Team filter
      if (filterOptions.selectedTeam) {
        const homeSquadId = match.homeSquadId.toString()
        const awaySquadId = match.awaySquadId.toString()
        if (
          homeSquadId !== filterOptions.selectedTeam &&
          awaySquadId !== filterOptions.selectedTeam
        ) {
          return false
        }
      }

      return true
    })
  }

  // Apply filters to both data sets
  const filteredIncomingMatches = filterMatches(sortedIncomingMatches)
  const filteredResultMatches = filterMatches(sortedResultMatches)

  const tabs = [
    {
      id: "future",
      label: t("Schedule.future"),
      isActive: !activeTab
    },
    {
      id: "result",
      label: t("Schedule.result"),
      isActive: activeTab
    }
  ]
  const currentPage = activeTab ? resultPage : futurePage
  const totalData = activeTab ? filteredResultMatches : filteredIncomingMatches
  const currentData = useMemo(
    () =>
      totalData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [totalData, currentPage]
  )
  //const totalItems = activeTab ? resultMatchData?.total : incomingMatch?.total

  const handleTabClick = (tab: string) => {
    if (tab === "future") {
      setActiveTab(false)
    } else if (tab === "result") {
      setActiveTab(true)
    }
  }

  const handleChangeInputNonText = ({
    name,
    value
  }: {
    name: string
    value: string | number
  }) => {
    setFilterOptions((prev) => ({
      ...prev,
      selectedMonth: name === "month" ? value.toString() : prev.selectedMonth,
      selectedYear: name === "year" ? value.toString() : prev.selectedYear,
      selectedTeam: name === "team" ? value.toString() : prev.selectedTeam
    }))
  }

  const handleSortChange = () => {
    setIsNewestToOldest((prev) => !prev)
    // Implement sorting logic here if needed
  }

  //Activate Result tab when redirected via URL
  useEffect(() => {
    if (router.query.tab === "result") {
      setActiveTab(true)
    } else {
      setActiveTab(false)
    }
  }, [router.query.tab])

  return (
    <div className="wl-home container mx-auto px-4 lg:px-0">
      <div className="mx-auto">
        <div className="flex justify-center p-4">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-between w-full my-4">
              <div className="flex items-center">
                <Title
                  title_text={t("MainPage.Schedule.title")}
                  fallback="Schedule"
                  isMobile={isMobile}
                />
              </div>
              <button
                onClick={handleSortChange}
                className="text-white font-medium flex items-center text-base lg:text-lg"
              >
                {isNewestToOldest ? t("Schedule.oldest") : t("Schedule.newest")}
                <Image
                  alt="filter"
                  url="/assets/filter.png"
                  width={14}
                  height={14}
                  classNames="ml-1"
                />
              </button>
            </div>
            <div className="flex w-full mb-6 mt-4">
              {tabs.map(({ id, label, isActive }) => (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`px-8 py-3 text-base font-medium w-full ${isActive
                    ? "bg-[#009919] text-white"
                    : "bg-white text-gray-800"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="border border-white boxBlurShadow pb-8 w-full">
              <div className="border-b border-white boxBlurShadow bg-black lg:px-[64px] p-4 lg:py-8">
                <div className="flex flex-col lg:flex-row justify-center items-center lg:gap-4 w-full">
                  <div className="flex flex-row gap-2 lg:gap-4 items-center justify-center w-full mb-4 lg:mb-0 lg:w-2/3">
                    <Select
                      name="year"
                      selectedOption={filterOptions.selectedYear || ""}
                      onChange={(option: any) => {
                        handleChangeInputNonText({
                          name: "year",
                          value: option
                        })
                      }}
                      options={[
                        {
                          value: "",
                          label: t("Schedule.allYears") || "All Years"
                        },
                        ...filterOptions.years.map((year) => ({
                          value: year,
                          label: year
                        }))
                      ]}
                      placeholder={t("Schedule.year")}
                      classNames="bg-white px-2 lg:px-4 pt-3 w-full"
                      compact={isMobile}
                    />

                    <Select
                      name="month"
                      selectedOption={filterOptions.selectedMonth || ""}
                      onChange={(option: any) => {
                        handleChangeInputNonText({
                          name: "month",
                          value: option // Ensure string value
                        })
                      }}
                      options={[
                        {
                          value: "",
                          label: t("Schedule.allMonths") || "All Months"
                        },
                        ...filterOptions.months
                      ]}
                      placeholder={t("Schedule.month")}
                      classNames="bg-white px-2 lg:px-4 pt-3 w-full"
                      compact={isMobile}
                    />
                  </div>

                  <div className="w-full lg:w-1/3">
                    <Select
                      name="team"
                      selectedOption={filterOptions.selectedTeam || ""}
                      //
                      onChange={(option: any) => {
                        handleChangeInputNonText({
                          name: "team",
                          value: option
                        })
                      }}
                      options={[
                        {
                          value: "",
                          label: t("Schedule.allTeams") || "All Teams"
                        },
                        ...filterOptions.teams.map((team) => ({
                          value: team.value.toString(), // Ensure string value
                          label: team.label
                        }))
                      ]}
                      placeholder={t("Schedule.all")}
                      classNames="bg-white px-4 py-3"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:px-[64px] p-4 lg:py-8">
                {!activeTab && currentData.length > 0 ? (
                  //Schedule
                  <div className="flex flex-col items-center justify-center">
                    {currentData.map((schedule, index, arr) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center justify-center w-full"
                        >
                          <ScheduleMatch matchData={schedule} squadsMap={squadsMap} />
                          {index < arr.length - 1 && (
                            <Line
                              orientation="horizontal"
                              classNames={cx(
                                "xl:block border border-white my-8"
                              )}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : // ) : activeTab && currentData.length > 0 ? (
                  //   // Result
                  //   <div className="flex flex-col items-center justify-center">
                  //     {currentData.map((schedule, index, arr) => {
                  //       return (
                  //         <div
                  //           key={index}
                  //           className="flex flex-col items-center justify-center w-full"
                  //         >
                  //           <ScheduleResult resultMatchData={schedule} />
                  //           {index < arr.length - 1 && (
                  //             <Line
                  //               orientation="horizontal"
                  //               classNames={cx(
                  //                 "xl:block border border-white my-8"
                  //               )}
                  //             />
                  //           )}
                  //         </div>
                  //       )
                  //     })}
                  //   </div>
                  // ) : (
                  activeTab && currentData.length > 0 ? (
                    // Result
                    <div className="flex flex-col items-center justify-center">
                      {currentData.map((schedule, index, arr) => {
                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center justify-center w-full"
                          >
                            <ScheduleResult resultMatchData={schedule} isBorder={true} squadsMap={squadsMap} />
                            {index < arr.length - 1 && (
                              <Line
                                orientation="horizontal"
                                classNames={cx(
                                  "xl:block border border-white my-8"
                                )}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
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
                          {t("MainPage.ContainerPage.empty_title")}
                        </Text>
                      </div>
                    </div>
                  )}
              </div>
            </div>
            {currentData.length > 0 && (
              <div className="flex justify-center mt-10">
                <Pagination
                  isMobile={isMobile}
                  size={PAGE_SIZE}
                  totalResult={totalData.length}
                  page={activeTab ? resultPage : futurePage}
                  handleChange={handlePaginationChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  query,
  locale
}: {
  query?: { [key: string]: string }
  locale: string
}) => {
  const futurePage = query?.futurePage || 1
  const resultPage = query?.resultPage || 1
  const scheduleMatchs = await getMatches(`?leagueId=${leagueId}`)
  const squadArray: ISquad[] = [];

  const filteredMatches =
    scheduleMatchs?.data?.data.filter((match: ISchedules) => {
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

  return {
    props: {
      futurePage: +futurePage,
      resultPage: +resultPage,
      incomingMatch: {
        data: filteredMatches.filter(
          (match: ISchedules) => match.status === matchStatus.NOT_STARTED
        ),
        total: filteredMatches.length
      },
      resultMatchData: {
        data: filteredMatches.filter(
          (match: ISchedules) => (match.status === matchStatus.COMPLETED) && (match.squadMatchResults)
        ),
        total: filteredMatches.length
      },
      squads: squadArray,
      ...(await serverSideTranslations(locale, ["langs"]))
    }
  }
}
