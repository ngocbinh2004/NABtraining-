import { formatScheduleDateTime } from "../../../../helpers/beautifyDate"
import { useTranslation } from "next-i18next"
import { cx } from "class-variance-authority"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
//ui
import Image from "../../../molecules/media/Image"
import Link from "next/link"
import TeamBlock from "../TeamBlock"
//constants
import { ISchedules } from "../../../../interfaces/schedule_type"
import { ISquad } from "interfaces/squad_detail_type"

interface ScheduleProps {
  resultMatchData: ISchedules
  fullDisplay?: boolean
  className?: string
  isLoading?: boolean
  isBorder?: boolean
  showWinnerBadge?: boolean
  showActionButtons?: boolean
  squadsMap: Map<number, ISquad>
}

export default function ScheduleMatch({
  resultMatchData,
  fullDisplay = false,
  showWinnerBadge = true,
  className,
  showActionButtons = true,
  isLoading = false,
  isBorder = false,
  squadsMap,
}: ScheduleProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const isHome = resultMatchData?.homeSquadId
  const [isMobile, setIsMobile] = useState(false)
  const homeTeam = squadsMap?.get(resultMatchData.homeSquadId) || null;
  const awayTeam = squadsMap?.get(resultMatchData.awaySquadId) || null;
  const [homeSquadMatchData, setHomeSquadMatchData] = useState<any>(null)
  const [isHomeWinTeam, setIsHomeWinTeam] = useState<boolean | null>(null)


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    const getHomeTeamMatchData = () => {
      if (!resultMatchData || !squadsMap) return;
      const squadMatchResults = resultMatchData?.squadMatchResults || []
      for (const squadMatchResult of squadMatchResults) {
        if (squadMatchResult.opponentSquadId !== resultMatchData.homeSquadId) {
          setHomeSquadMatchData(squadMatchResult)
          break
        }
      }
    }

    getHomeTeamMatchData()
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [resultMatchData, squadsMap])

  useEffect(() => {
    if (!homeSquadMatchData) return
    const won = homeSquadMatchData?.wonRounds ?? null
    const lost = homeSquadMatchData?.lostRounds ?? null

    if (typeof won === 'number' && typeof lost === 'number') {
      setIsHomeWinTeam(won > lost)
    }
  }, [homeSquadMatchData])


  const { datePart, timePart } = formatScheduleDateTime(
    resultMatchData.matchedAt ?? "",
    t
  )

  return (
    <div className="w-full flex flex-col lg:flex-row justify-center py-6">
      <div className="w-full flex justify-center items-center gap-2 lg:gap-[32px] ">
        {/* Team 1 */}
        <TeamBlock team={awayTeam} isLeft={true} isMobile={isMobile} />
        {/* Score */}
        <div className="w-[50%] max-w-[190px] flex flex-col justify-center items-center">
          {!isBorder ? (
            <span className="font-bold text-white text-[12px] sm:text-[16px] text-center mb-1">
              {resultMatchData?.code || "?"}
          </span>
          ) : (

            <div className={cx(
              "flex flex-row items-center justify-center w-full font-bold",
              !fullDisplay ? "gap-[8px]" : ""
            )}>
              <div className="border-t border-[#C7C7C7] mr-2 w-[10px]"></div>
              <span className="text-white text-[12px] sm:text-[16px] text-center mb-1">
                {resultMatchData?.code || "?"}
              </span>
              <div className="border-t border-[#C7C7C7] ml-2 w-[10px]"></div>
            </div>
          )}

          <div className="flex flex-col justify-center items-center w-full">
            {resultMatchData && (
              <div
                className={cx(
                  "flex justify-center items-center gap-2 lg:gap-4 w-full",
                  fullDisplay ? "flex-col" : "flex-row"
                )}
              >
                {/* Team 1 */}
                {!fullDisplay && (
                  <div className="flex flex-col justify-center items-center">
                    {/* Winner Badge */}
                    {showWinnerBadge && (
                    <div className="h-[20px] mb-1 flex items-center justify-center">
                      {!isHomeWinTeam && (
                        <div className="rounded-full bg-[#FF7A28] w-[18px] h-[18px] flex justify-center items-center mb-2">
                          <span className="font-light text-white text-[14px]">
                            W
                          </span>
                        </div>
                      )}
                    </div>
                    )}

                    {/* Score */}
                    <span className="font-bold text-white text-[24px] lg:text-[40px] text-center mb-2">
                      {homeSquadMatchData?.lostRounds +
                        homeSquadMatchData?.drawRounds || 0}
                    </span>
                  </div>
                )}
                {fullDisplay && (
                  <div className="flex flex-row justify-between items-center gap-5 w-full font-bold">
                    <span className={cx(
                      "font-extrabold italic text-white text-[40px] text-center my-5",
                      isHomeWinTeam ? "opacity-70" : "opacity-100"
                    )}>
                      {homeSquadMatchData?.lostRounds +
                        homeSquadMatchData?.drawRounds || 0}
                    </span>
                    <span className="font-extrabold italic text-white text-[40px] text-center my-5">
                      :
                    </span>
                    <span
                      className={cx(
                        "font-extrabold italic text-white text-[40px] text-center my-5",
                        isHomeWinTeam ? "opacity-100" : "opacity-70"
                      )}
                    >
                      {homeSquadMatchData?.wonRounds +
                        homeSquadMatchData?.drawRounds || 0}
                    </span>
                  </div>
                )}
                {/* Date & Time Center Info */}
                <div
                  className={cx(
                    "flex justify-center items-center mx-4 font-bold",
                    fullDisplay ? "flex-row gap-1" : "flex-col"
                  )}
                >
                  <span className="font-semibold text-[14px] sm:text-[16px] text-white text-center mb-1">
                    {datePart}
                  </span>
                  <span className="font-semibold text-[12px] sm:text-[16px] text-white text-center mb-1">
                    {timePart}
                  </span>
                </div>

                {/* Team 2 */}
                {!fullDisplay && (
                  <div className="flex flex-col justify-center items-center">
                    {/* Winner Badge */}
                    {showWinnerBadge && (
                    <div className="h-[20px] mb-1 flex items-center justify-center">
                      {isHomeWinTeam && (
                        <div className="rounded-full bg-[#FF7A28] w-[18px] h-[18px] flex justify-center items-center mb-2">
                          <span className="font-light text-white text-[14px]">
                            W
                          </span>
                        </div>
                      )}
                    </div>
                    )}

                    {/* Score */}
                    <span className="font-bold text-white text-[24px] lg:text-[40px] text-center mb-2">
                      {homeSquadMatchData?.wonRounds +
                        homeSquadMatchData?.drawRounds || 0}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <span className="font-bold text-[12px] sm:text-[20px] text-white text-center mb-2">
            {resultMatchData?.venue}
          </span>
        </div>
        {/* Team 2 */}
        <TeamBlock team={homeTeam} isLeft={false} isMobile={isMobile} />
      </div>
      {(!fullDisplay && showActionButtons) && (
        <div className="flex flex-row justify-center items-center">
          <Link
            href="/coming-soon"
            className="flex justify-center items-center ml-2"
          >
            <button
              className={cx(
                "w-full lg:w-[120px] items-start mt-4",
                "flex flex-row justify-center items-center border border-white",
                "min-w-fit px-3 text-button py-3 font-bold"
              )}
            >
              <Image
                alt="review"
                url="/assets/time-forward.png"
                objectFit="object-contain"
                height={16}
                width={16}
                classNames="h-[16px] w-[16px] mr-2"
              />
              <span className="text-[16px] text-white">
                {t("Schedule.review")}
              </span>
            </button>
          </Link>
          <Link
            href={`/schedule/${resultMatchData?.id}`}
            className="flex justify-center items-center ml-2"
          >
            <button
              className={cx(
                "w-full lg:w-[120px] items-start mt-4 bg-[#009919]",
                "flex flex-row justify-center items-center rounded-none",
                "min-w-fit px-3 text-button py-3 font-bold"
              )}
            >
              <Image
                alt="record"
                url="/assets/signal.png"
                objectFit="object-contain"
                height={16}
                width={16}
                classNames="h-[16px] w-[16px] mr-2"
              />
              <span className="text-[16px] text-white">
                {t("Schedule.record")}
              </span>
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
