import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cx } from "class-variance-authority";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Title from "@/components/common/Title";
import Select from "@/molecules/form/Select";
import { IRoster } from "interfaces/roster_type";
import { Squad } from "interfaces/squad_type";
import { GetServerSideProps } from "next";
import { TFunction } from "i18next";
import {
  getEventDetail,
  getEventRosterStatistics,
  getEvents,
  getRoster,
  getSeasons,
  getSquad,
} from "helpers/newApi";
import Image from "next/image";
import IEventRosterStatistics from "interfaces/event_roster_stats_type";
import { IApiEvent as IEvent } from "interfaces/event_type";
import { ISeason } from "interfaces/season_type";
import { ISquad } from "interfaces/squad_detail_type";
import { formatSeasonYear } from "helpers/beautifyDate";
import displayPoints from "@/components/player-rankings/displayPoints";
interface FilterChangeEvent {
  name: keyof FilterOptions;
  value: string | number;
}

interface FilterOptions {
  selectedSeason: string;
  selectedEvent: string;
  selectedSquad: string;
  selectedPosition: string;
}

export interface IPlayerDetails {
  name: string;
  jerseyNumber: string;
  position: string;
  avatarUrl: string;
  squadId: string;
  rosterId: string;
  eventId: string;
  squadName: string;
  stats?: IEventRosterStatistics | null;
  title?: string | null;
}

interface IProps {
  all_events: IEvent[];
  event_squads: Squad[];
  all_seasons: ISeason[];
  playersInfo: IPlayerDetails[];
  eventId: string;
  seasonId: string;
}

export default function PlayerRanking({
  all_events,
  event_squads,
  all_seasons,
  playersInfo,
  eventId,
  seasonId,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const firstLoad = useRef(true);
  const [isDisabled, setIsDisable] = useState(false);
  const keys: (keyof FilterOptions)[] = [
    "selectedSeason",
    "selectedEvent",
    "selectedSquad",
    "selectedPosition",
  ];
  const topPlayers = playersInfo.slice(0,6);

  const [filterOptions, setFilterOptions] = useState({
    seasons: [] as { value: string; label: string }[],
    events: [] as { value: string; label: string }[],
    squads: [] as { value: string; label: string }[],
    positions: [] as { value: string; label: string }[],
    selectedSeason: "",
    selectedEvent: "",
    selectedSquad: "",
    selectedPosition: "",
  });

  // Initialize filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      const eventOptions = all_events
        .filter(ev => ev.seasonId.toString() === seasonId)
        .map((ev) => ({
          value: ev.id.toString(),
          label: ev.name,
        }));

      const seasonOptions = all_seasons.map((ss) => ({
        value: ss.id.toString(),
        label: formatSeasonYear(ss),
      }));

      const squadOptions = event_squads.map((sq) => ({
        value: sq.id.toString(),
        label: sq.name,
      }));

      const positionOptions = [
        {
          value: "outside_hitter",
          label: t("PlayerRankingPage.select_box.title_box.outside_hitter"),
        },
        {
          value: "middle_blocker",
          label: t("PlayerRankingPage.select_box.title_box.middle_blocker"),
        },
        {
          value: "setter",
          label: t("PlayerRankingPage.select_box.title_box.setter"),
        },
        {
          value: "opposite_hitter",
          label: t("PlayerRankingPage.select_box.title_box.opposite_hitter"),
        },
        {
          value: "libero",
          label: t("PlayerRankingPage.select_box.title_box.libero"),
        },
        {
          value: "top_scorer",
          label: t("PlayerRankingPage.select_box.title_box.top_scorer"),
        },
      ];

      //get index of seasonId from the ssr
      const seasonIndex: number = Math.max(all_seasons.findIndex(ss => ss.id.toString() === seasonId), 0);

      setFilterOptions((prev) => ({
        ...prev,
        seasons: seasonOptions,
        events: eventOptions,
        squads: squadOptions,
        positions: positionOptions,

        selectedSeason: seasonOptions[seasonIndex].value,
        selectedPosition: positionOptions[0].value,
        selectedSquad: "",
      }));

      firstLoad.current = true;
      setIsDisable(false);
    };
    loadFilterOptions();
  }, [all_events, all_seasons, event_squads, t, seasonId]);

  
  // Filter players based on selected squad and position
  const playersFilter = useMemo(() => {
    return playersInfo.filter((player) => {
      // Filter by squad
      if (
        filterOptions.selectedSquad &&
        filterOptions.selectedSquad !== player.squadId
      ) {
        return false;
      }

      // Filter by position or top scorer
      if (filterOptions.selectedPosition) {
        const isTopScorer = filterOptions.selectedPosition === "top_scorer";
        const valueToCheck = isTopScorer ? player.title : player.position;
        if (
          !valueToCheck ||
          getTitleValue(valueToCheck) !== filterOptions.selectedPosition
        ) {
          return false;
        }
      }

      return true;
    });
  }, [playersInfo, filterOptions]);


  //Filter events when select a season
  useEffect(() => {
    if (filterOptions.selectedSeason) {
      const eventOptions = all_events
        .filter((ev) => ev.seasonId.toString() === filterOptions.selectedSeason)
        .map((ev) => ({
          value: ev.id.toString(),
          label: ev.name,
        }));

      let selectedValue = "";
      if (firstLoad.current) {
        const idx = eventOptions.findIndex(ev => ev.value === eventId);
        if (idx >= 0) {
          selectedValue = eventOptions[idx].value;
        }
      }

      setFilterOptions((prev) => ({
        ...prev,
        events: eventOptions,
        selectedEvent: selectedValue,
      }));

      firstLoad.current = false;
    }
  }, [filterOptions.selectedSeason, all_events, eventId]);


  //Handle when select from select boxes
  const handleFilterChange = ({ name, value }: FilterChangeEvent) => {
    if (name === "selectedEvent") {
      setIsDisable(true);
      router.push(`?eventId=${value}`);
    }
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function getTitleValue(title: string): string {
    if (!title) return "";
    const map: Record<string, string> = {
      OutsideHitter: "outside_hitter",
      OppositeHitter: "opposite_hitter",
      MiddleBlocker: "middle_blocker",
      Setter: "setter",
      Libero: "libero",
      TopScorer: "top_scorer",
    };
    const key = map[title];
    return key;
  }

  // Function to translate title get by api
  function getTitleLabel(title: string): string {
    if (!title) return "";
    const map: Record<string, string> = {
      OutsideHitter: "outside_hitter",
      OppositeHitter: "opposite_hitter",
      MiddleBlocker: "middle_blocker",
      Setter: "setter",
      Libero: "libero",
      TopScorer: "top_scorer",
    };
    const key = map[title];
    if (!key) return "Unknow";
    return t(`PlayerRankingPage.select_box.title_box.${key}`);
  }

  //Disable select box when loading
  const getSelectBoxClass = (isDisabled: boolean) => {
    return isDisabled ? "w-full pointer-events-none opacity-90" : "w-full";
  };

  //Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateTableHeaders = (
    labels: string[],
    isMainCol: boolean
  ): JSX.Element => {
    return (
      <>
        {labels.map((label, idx) => (
          <th
            key={idx}
            className={cx(
              "font-normal p-4 text-sm lg:text-base text-center whitespace-nowrap",
              (idx === 0 || idx === 1) && isMainCol ? "bg-black" : "bg-[#202020]"
            )}
          >
            {label}
          </th>
        ))}
      </>
    );
  };

  const titleComponentMap: Record<string, JSX.Element> = {
    outside_hitter: generateTableHeaders(
      [
        t("PlayerRankingPage.player_stats.spikes"),
        t("PlayerRankingPage.player_stats.score"),
        t("PlayerRankingPage.player_stats.success_rate"),
      ],
      false
    ),
    middle_blocker: generateTableHeaders(
      [
        t("PlayerRankingPage.player_stats.spikes"),
        t("PlayerRankingPage.player_stats.score"),
        t("PlayerRankingPage.player_stats.blocks"),
        t("PlayerRankingPage.player_stats.score"),
        t("PlayerRankingPage.player_stats.success_rate"),
      ],
      false
    ),
    setter: generateTableHeaders(
      [
        t("PlayerRankingPage.player_stats.sets"),
        t("PlayerRankingPage.player_stats.success_count"),
        t("PlayerRankingPage.player_stats.success_rate"),
      ],
      false
    ),
    opposite_hitter: generateTableHeaders(
      [
        t("PlayerRankingPage.player_stats.spikes"),
        t("PlayerRankingPage.player_stats.score"),
        t("PlayerRankingPage.player_stats.blocks"),
        t("PlayerRankingPage.player_stats.score"),
        t("PlayerRankingPage.player_stats.total"),
        t("PlayerRankingPage.player_stats.success_rate"),
      ],
      false
    ),
    libero: generateTableHeaders(
      [
        t("PlayerRankingPage.player_stats.passes"),
        t("PlayerRankingPage.player_stats.success"),
        t("PlayerRankingPage.player_stats.defenses"),
        t("PlayerRankingPage.player_stats.success"),
        t("PlayerRankingPage.player_stats.total_number"),
        t("PlayerRankingPage.player_stats.success_rate"),
      ],
      false
    ),
    top_scorer: generateTableHeaders(
      [
        t("PlayerRankingPage.position.position"),
        t("PlayerRankingPage.player_stats.completed_spikes"),
        t("PlayerRankingPage.player_stats.completed_blocks"),
        t("PlayerRankingPage.player_stats.completed_serves"),
        t("PlayerRankingPage.player_stats.total_points"),
        t("PlayerRankingPage.player_stats.average_points_per_set"),
        t("PlayerRankingPage.player_stats.average_points_per_game"),
      ],
      false
    ),
  };

  const renderTitleComponent = (value: string): JSX.Element => {
    return titleComponentMap[value] || <></>;
  };

  // Function to translate position get by api
  function getPositionLabel(position: string): string {
    if (!position) return "";
    const map: Record<string, string> = {
      OutsideHitter: "outside_hitter",
      OppositeHitter: "opposite_hitter",
      MiddleBlocker: "middle_blocker",
      Setter: "setter",
      Libero: "libero",
    };
    const key = map[position];
    if (!key) return "Unknow";
    return t(`PlayerRankingPage.position.${key}`);
  }

  const buildPlayerRow = (
    player: IPlayerDetails,
    index: number,
    selectedPosition: string
  ): (string | number)[] => {
    const baseData = [
      index + 1,
      player?.name ?? "Unknown",
      player?.jerseyNumber ?? "Unknown",
      player?.squadName ?? "Unknown",
      player?.stats?.matchCount ?? "0",
      player?.stats?.roundCount ?? "0",
    ];
    switch (selectedPosition) {
      case "outside_hitter":
        baseData.push(
          player?.stats?.spikes ?? "0",
          player?.stats?.completedSpikes ?? "0",
          `${player?.stats?.spikesMetrics?.successPercentage ?? 0}%`
        );
        break;
      case "middle_blocker":
        baseData.push(
          player?.stats?.spikes ?? "0",
          player?.stats?.completedSpikes ?? "0",
          player?.stats?.blocks ?? "0",
          player?.stats?.completedBlocks ?? "0",
          `${player?.stats?.blocksMetrics?.successPercentage ?? 0}%`
        );
        break;
      case "setter":
        baseData.push(
          player?.stats?.sets ?? 0,
          player?.stats?.completedSets ?? "0",
          `${player?.stats?.setsMetrics?.successPercentage ?? 0}%`
        );
        break;
      case "opposite_hitter":
        {
          const total =
            (player?.stats?.spikes ?? 0) + (player?.stats?.blocks ?? 0);
          const totalSuccess =
            (player?.stats?.completedSpikes ?? 0) +
            (player?.stats?.completedBlocks ?? 0);
          const successRate =
            total > 0 ? ((totalSuccess / total) * 100).toFixed(1) : "0.0";
          baseData.push(
            player?.stats?.spikes ?? "0",
            player?.stats?.completedSpikes ?? "0",
            player?.stats?.blocks ?? "0",
            player?.stats?.completedBlocks ?? "0",
            String(total),
            `${successRate}%`
          );
        }
        break;
      case "libero":
        {
          const total =
            (player?.stats?.passes ?? 0) + (player?.stats?.defenses ?? 0);
          const totalSuccess =
            (player?.stats?.completedPasses ?? 0) +
            (player?.stats?.completedDefenses ?? 0);
          const successRate =
            total > 0 ? ((totalSuccess / total) * 100).toFixed(1) : "0.0";
          baseData.push(
            player?.stats?.passes ?? "0",
            player?.stats?.completedPasses ?? "0",
            player?.stats?.defenses ?? "0",
            player?.stats?.completedDefenses ?? "0",
            String(total),
            `${successRate}%`
          );
        }
        break;
      case "top_scorer":
        {
          const stats = player?.stats;
          const AveragePointsPerSet =
            stats && stats.roundCount
              ? ((stats.score ?? 0) / stats.roundCount).toFixed(1)
              : 0;
          const AveragePointsPerGame =
            stats && stats.matchCount
              ? ((stats.score ?? 0) / stats.matchCount).toFixed(1)
              : 0;
          baseData.push(
            getPositionLabel(player?.position),
            player?.stats?.completedSpikes ?? "0",
            player?.stats?.completedBlocks ?? "0",
            player?.stats?.completedServes ?? "0",
            String(
              (player?.stats?.completedSpikes ?? 0) +
                (player?.stats?.completedBlocks ?? 0) +
                (player?.stats?.completedServes ?? 0)
            ),
            String(AveragePointsPerSet),
            String(AveragePointsPerGame)
          );
        }
        break;
      default:
        break;
    }
    return baseData;
  };


  return (
    <div className="wl-home container mx-auto px-4 lg:px-0">
      <div className="mx-auto">
        <div className="flex justify-center p-4">
          <div className="flex flex-col items-center w-full">
            {/* This is the title */}
            <div className="flex items-center w-full my-4">
              <Title
                title_text={t("PlayerRankingPage.title")}
                fallback="Player Rankings"
                isMobile={isMobile}
              />
            </div>

            {/* This is for top player cards */}
            <div className="w-full h-full mb-10">
              {!isMobile ? (
                // -------- Desktop View --------
                <div className="flex flex-wrap w-full h-full justify-between gap-y-6 mb-10">
                  {topPlayers?.slice(0, 6).map((player) => (
                    <div
                      key={player.rosterId}
                      className="border border-white boxBlurShadow w-[32%] min-w-[320px] p-6 flex flex-col text-white justify-between items-center"
                    >
                      {/* Row 1: Avatar + Right info */}
                      <div className="flex flex-row w-full items-center gap-4 mb-4">
                        <div className="w-[120px] max-w-full aspect-square bg-gray-200 rounded-full overflow-hidden relative">
                          <Image
                            src={player?.avatarUrl || "/assets/no-image-available-square.png"}
                            alt="Player photo"
                            className="object-cover object-top"
                            fill
                          />
                        </div>

                        <div className="flex flex-col flex-1 w-[60%]">
                          <div className="flex items-center gap-2 w-full min-w-0">
                            {(() => {
                              const fullName =
                                `${player?.name || "Unknown Player"} #${player?.jerseyNumber || "00"}`.replace(/\s+/g, " ");
                              return (
                                <span 
                                  className="truncate h-[30px] min-w-0 max-w-full flex-1 font-bold text-[clamp(14px,2vw,28px)] h-[30px] cursor-pointer block"
                                  title={fullName}
                                >
                                  {fullName}
                                </span>
                              );
                            })()}
                          </div>

                          <span className="font-normal mt-1 [font-size:clamp(14px,2vw,18px)]">
                            {player?.squadName}
                          </span>
                        </div>

                      </div>

                      <div className="border-t border-white w-full mb-4"></div>

                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="bg-[#009465] px-2 py-1 text-base font-medium font-pingFang">
                          {getTitleLabel(cx(
                            player?.title ? player.title : player?.position ?? ""
                          ))}
                        </div>
                        {displayPoints(filterOptions.selectedPosition, player, t)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // -------- Mobile View --------
                <div className="flex overflow-x-auto gap-4 no-scrollbar">
                  {topPlayers?.slice(0, 6).map((player) => (
                    <div
                      key={player.rosterId}
                      className="border border-white boxBlurShadow w-[217px] h-[285px] p-4 flex-shrink-0 flex flex-col text-white items-center"
                    >
                      <div className="w-[100px] h-[100px] bg-gray-200 rounded-full overflow-hidden relative mb-3">
                        <Image
                          src={
                            player?.avatarUrl ||
                            "/assets/no-image-available-square.png"
                          }
                          alt="Player photo"
                          className="object-cover object-top"
                          fill
                        />
                      </div>

                      <div className="flex flex-row items-center justify-center gap-2">
                        <span className="text-[24px] h-[30px] font-bold text-center truncate max-w-[140px]">
                          {player?.name || "Unknown Player"}
                        </span>
                        <span className="text-[18px] font-bold">
                          #{player?.jerseyNumber || "00"}
                        </span>
                      </div>

                      <span className="text-[16px] mt-1 text-center">
                        {player?.squadName || "Unknown Team"}
                      </span>

                      <div className="border-t border-white w-full my-3"></div>

                      <div className="flex flex-row justify-between items-center w-full mt-auto">
                        <div className="bg-[#009465] px-2 py-1 text-sm font-medium font-pingFang">
                          {getTitleLabel(cx(
                            player?.title ? player.title : player?.position ?? ""
                          ))}
                        </div>
                        {displayPoints(filterOptions.selectedPosition, player, t)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* This is the board for player ranking */}
            <div className="border border-white boxBlurShadow w-full mb-5">
              <div className="border-b border-white boxBlurShadow bg-black lg:px-[64px] p-4 lg:py-8">
                {!isMobile ? (
                  // -------- Desktop view --------
                  <div className="flex flex-col md:flex-row justify-center items-center md:gap-4 w-full">
                    {[
                      filterOptions.selectedSeason, 
                      filterOptions.selectedEvent,
                      filterOptions.selectedSquad,
                      filterOptions.selectedPosition
                      ].map(
                      (selected, i) => (
                        <div
                          key={i}
                          className="items-center justify-center w-full mb-4 md:mb-0 md:flex-1 md:h-12"
                        >
                          <Select
                            name={["season", "event", "squad", "position"][i]}
                            selectedOption={selected}
                            onChange={(value: string) =>
                              handleFilterChange({ name: keys[i], value })
                            }
                            options={
                              [filterOptions.seasons, 
                                filterOptions.events, 
                                [
                                  { label: "all squads", value: "" },
                                  ...filterOptions.squads
                                ],
                                filterOptions.positions
                              ][i]
                            }
                            placeholder={t(
                              `PlayerRankingPage.select_box.${[
                                "select_season_placeholder",
                                "select_event_placeholder",
                                "select_squad_placeholder",
                                "select_position_placeholder",
                              ][i]
                              }`
                            )}
                            compact={isMobile}
                            classNames={getSelectBoxClass(isDisabled)}
                          />
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  // -------- Mobile view --------
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="col-span-1 w-full">
                      <Select
                        name="season"
                        selectedOption={filterOptions.selectedSeason}
                        onChange={(value: string) =>
                          handleFilterChange({ name: "selectedSeason", value })
                        }
                        options={filterOptions.seasons}
                        compact={isMobile}
                        classNames={getSelectBoxClass(isDisabled)}
                      />
                    </div>
                    <div className="col-span-1 w-full">
                      <Select
                        name="event"
                        selectedOption={filterOptions.selectedEvent}
                        onChange={(value: string) =>
                          handleFilterChange({ name: "selectedEvent", value })
                        }
                        options={filterOptions.events}
                        placeholder={t(
                          "PlayerRankingPage.select_box.select_event_placeholder"
                        )}
                        compact={isMobile}
                        classNames={getSelectBoxClass(isDisabled)}
                      />
                    </div>
                    <div className="col-span-2 w-full">
                      <Select
                        name="squad"
                        selectedOption={filterOptions.selectedSquad}
                        onChange={(value: string) =>
                          handleFilterChange({ name: "selectedSquad", value })
                        }
                        options={[
                          { label: "all squads", value: "" },
                          ...filterOptions.squads,
                        ]}
                        placeholder={t(
                          "PlayerRankingPage.select_box.select_squad_placeholder"
                        )}
                        compact={isMobile}
                        classNames={getSelectBoxClass(isDisabled)}
                      />
                    </div>
                    <div className="col-span-2 w-full">
                      <Select
                        name="position"
                        selectedOption={filterOptions.selectedPosition}
                        onChange={(value: string) =>
                          handleFilterChange({ name: "selectedPosition", value })
                        }
                        options={filterOptions.positions}
                        compact={isMobile}
                        classNames={getSelectBoxClass(isDisabled)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ranking table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead className="border-white border-b h-20">
                    <tr className="text-white">
                      {generateTableHeaders([
                        t("PlayerRankingPage.player_stats.rank"),
                        t("PlayerRankingPage.player_stats.fullname"),
                        t("PlayerRankingPage.player_stats.jersey_number"),
                        t("PlayerRankingPage.player_stats.squad"),
                        t("PlayerRankingPage.player_stats.matches_played"),
                        t("PlayerRankingPage.player_stats.rounds_played"),
                      ], true)}
                      {/* Add more column base on the selected title */}
                      {filterOptions.selectedPosition && renderTitleComponent(filterOptions.selectedPosition)}
                    </tr>
                  </thead>

                  <tbody className="text-white">
                    {playersFilter
                      ?.slice(0, 20)
                      .map((player, index) => (
                        <tr
                          key={player.rosterId}
                          className="text-center border-white border-b h-16 cursor-pointer hover:bg-[#1a3d2b] transition-colors"
                          onClick={() => {
                            router.push(
                              `/player-profile?rosterId=${player?.rosterId ?? 0
                              }`
                            );
                          }}
                        >
                          {buildPlayerRow(player, index, filterOptions.selectedPosition).map(
                            (value, idx) => (
                              <td
                                key={idx}
                                className={cx(
                                  "p-4 text-xs lg:text-base whitespace-nowrap text-center border-b border-[#FFFFFF]",
                                  idx < 2 ? "bg-[#002116]" : "bg-[#005235]"
                                )}
                              >
                                {value}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

  const leagueId = process.env.NEXT_CUSTOMER_LEAGUE_ID || null;
  if (!leagueId) {
    return { notFound: true } as const;
  }

  const events: IEvent[] = [];
  const eventSquads: ISquad[] = [];
  const rosters: IRoster[] = [];

  const seasonRes = await getSeasons(leagueId);
  const seasons: ISeason[] = seasonRes?.data?.data || [];
  seasons.sort((a, b) => {
    const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
    const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
    return bTime - aTime;
  });

  const eventsRes = (
    await Promise.all(
      seasons.map((s) => getEvents(s.id).then((res) => res?.data?.data || []))
    )
  ).flat();
  events.push(...eventsRes);
  events.sort((a, b) => {
    const aTime = a.registrationEndTime
      ? new Date(a.registrationEndTime).getTime()
      : 0;
    const bTime = b.registrationEndTime
      ? new Date(b.registrationEndTime).getTime()
      : 0;
    return bTime - aTime;
  });

  const eventIdQuery = query?.eventId as string;
  let eventId = events[0].id.toString();
  // If eventIdQuery exists, check if it is valid
  if (eventIdQuery) {
    const isValid = (value: unknown): boolean => {
      return (
        (typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value)))
      );
    };

    const isInEventsArray = events.some((ev) => ev.id.toString() === eventIdQuery);

    if (isValid(eventIdQuery) && isInEventsArray) {
      eventId = eventIdQuery;
    } else {
      return { notFound: true } as const;
    }
  }

  //Get squads from eventId
  const eventSquadsRes = await getSquad(eventId);
  eventSquads.push(...(eventSquadsRes?.data?.data || []));
  if (!eventSquads.length) {
    return { notFound: true } as const;
  }
  const squadsMap = new Map<number, ISquad>();
  eventSquads.forEach((esq) => squadsMap.set(esq.id, esq));

  //Get all rosters from squads
  const rostersRes = (
    await Promise.all(
      eventSquads.map((sq) =>
        getRoster(sq.id).then((res) => res?.data?.data || [])
      )
    )
  ).flat();
  rosters.push(...rostersRes);

  const playersInfo: IPlayerDetails[] = rosters.map((r) => ({
    name: r.personalInfo.name,
    jerseyNumber: r.jerseyNumber,
    position: r.position,
    avatarUrl: r.personalInfo.avatarUrl,
    squadId: r.squadId.toString(),
    rosterId: r.id.toString(),
    eventId: squadsMap.get(r.squadId)?.eventId?.toString() || "0",
    squadName: squadsMap.get(r.squadId)?.name || "Unknown",
  }));

  //Get stats for player
  const batchSize = 50;
  for (let i = 0; i < playersInfo.length; i += batchSize) {
    const batch = playersInfo.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (p) => {
        const playerStats =
          (await getEventRosterStatistics(p.eventId, p.rosterId))?.data?.data ||
          null;
        playerStats ? p.stats = playerStats[0] : p.stats = null;
      })
    );
  }

  //Sort player score desc
  playersInfo.sort((a, b) => (b.stats?.score ?? 0) - (a.stats?.score ?? 0));

  //Assign the "TopScorer" title to the player with the highest score in each squad
  const squadSet = new Set<string>();
  playersInfo.forEach((player) => {
    if (!squadSet.has(player.squadId)) {
      player.title = "TopScorer";
      squadSet.add(player.squadId);
    }
  });

  //select data for select boxes
  const eventDetail = (await getEventDetail(eventId))?.data?.data as IEvent | null;
  const seasonId = eventDetail?.seasonId?.toString() || "";


  return {
    props: {
      all_events: events,
      all_seasons: seasons,
      event_squads: eventSquads,
      playersInfo: playersInfo,
      eventId: eventId,
      seasonId: seasonId,
      ...(await serverSideTranslations(locale || "en", ["langs"])),
    },
  };
};
