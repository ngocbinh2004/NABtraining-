import { formatScheduleDateTime } from "../../../../helpers/beautifyDate"
import { useTranslation } from "next-i18next"
import { cx } from "class-variance-authority"
import { useEffect, useState } from "react"
//ui
import Image from "../../../molecules/media/Image"
import Link from "next/link"
//constants
import { ISchedules } from "../../../../interfaces/schedule_type"
import TeamBlock from "../TeamBlock"
import { ISquad } from "interfaces/squad_detail_type"

interface ScheduleProps {
  matchData: ISchedules
  className?: string
  isLoading?: boolean
  squadsMap: Map<number, ISquad>
}

export default function ScheduleMatch({
  matchData,
  squadsMap,
  className,
  isLoading = false
}: ScheduleProps) {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const homeTeam = squadsMap?.get(matchData.homeSquadId) || null;
  const awayTeam = squadsMap?.get(matchData.awaySquadId) || null;

  const { datePart, timePart } = formatScheduleDateTime(
    matchData.matchedAt ?? "",
    t
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])


  return (
    <div className="w-full flex flex-col lg:flex-row justify-center">
      <div className="w-full flex justify-center items-center gap-2 lg:gap-[32px] ">
        {/* Team 1 */}
        <TeamBlock team={awayTeam} isLeft={true} isMobile={isMobile} />
        {/* Date */}
        <div className="w-[50%] flex justify-center items-center font-bold">
          <div className="flex flex-col justify-center items-center">
            {matchData?.matchedAt && (
              <>
                <span className={cx(
                    "flex flex-row items-center justify-center w-full font-bold"
                  )}>
                  <div className="border-t border-[#C7C7C7] mr-2 w-[10px]"></div>
                  <span className="text-white text-[12px] sm:text-[16px] text-center mb-1">
                    {matchData?.code || "?"}
                  </span>
                  <div className="border-t border-[#C7C7C7] ml-2 w-[10px]"></div>
                </span>
                <span className="font-bold text-[14px] sm:text-[16px] text-white text-center mb-2">
                  {datePart}
                </span>
                <span className="font-bold text-[12px] sm:text-[16px] text-white text-center mb-2">
                  {timePart}
                </span>
                <span className="font-semibold text-[12px] sm:text-[20px] text-white text-center mb-2">
                  {matchData.venue}
                </span>
              </>
            )}
          </div>
        </div>
        {/* Team 2 */}
        <TeamBlock team={homeTeam} isLeft={false} isMobile={isMobile} />
      </div>
      <Link
        href="/coming-soon"
        className="flex justify-center items-center ml-2"
      >
        <button
          className={cx(
            "w-full lg:w-[120px] items-start mt-4 bg-[#009919]",
            "flex flex-row justify-center items-center rounded-none",
            "min-w-fit px-3 text-button py-3 font-semibold"
          )}
        >
          <Image
            alt="nticket"
            url="/assets/ticket.png"
            objectFit="object-contain"
            height={16}
            width={16}
            classNames="h-[16px] w-[16px] mr-2"
          />
          <span className="text-[16px] text-white">
            {t("Schedule.buy_ticket")}
          </span>
        </button>
      </Link>
    </div>
  )
}