import { useTranslation } from "next-i18next"
import { RiArrowRightSLine } from "react-icons/ri"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { cx } from "class-variance-authority"

//ui
import Text from "@/atoms/Text"
import Image from "@/molecules/media/Image"
import LinkText from "@/molecules/LinkText"
import Line from "@/atoms/Line"
import Icon from "@/atoms/Icon"
//constants
import { ISchedules } from "interfaces/schedule_type"
import ScheduleMatch from "@/organisms/card/schedule/ScheduleMatch"
import ScheduleResult from "@/organisms/card/schedule/ScheduleResult"
import Title from "@/components/common/Title"
import { ISquad } from "interfaces/squad_detail_type"

interface ScheduleProps {
  resultMatchData?: ISchedules[]
  incomingMatch?: ISchedules[]
  className?: string
  isLoading?: boolean
  squadsMap: Map<number, ISquad>
}

export default function Schedule({
  incomingMatch,
  resultMatchData,
  squadsMap,
  className,
  isLoading = false
}: ScheduleProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
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

  const handleTabClick = (tab: string) => {
    if (tab === "future") {
      setActiveTab(false)
    } else if (tab === "result") {
      setActiveTab(true)
    }
  }

  return (
    <section className="wl-home__schedule flex flex-col items-center mt-12">
      <div className="flex items-center justify-between w-full my-4">
        <div className="flex items-center">
          <Title
            title_text={t("MainPage.Schedule.title")}
            fallback="Schedule"
            isMobile={isMobile}
          />
        </div>
        <LinkText
          href="/schedule/schedule"
          size="body2"
          classNames="text-white font-medium flex items-center text-base lg:text-lg"
        >
          {t("MainPage.Schedule.full_schedule")}
          <RiArrowRightSLine size={24} className="ml-1 text-white" />
        </LinkText>
      </div>
      <div className="flex w-full mb-6 mt-4">
        {tabs.map(({ id, label, isActive }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`px-8 py-3 text-base font-medium w-full ${isActive ? "bg-[#009919] text-white" : "bg-white text-gray-800"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="border border-white boxBlurShadow mb-4 w-full lg:px-[64px] p-4 lg:py-8">
        {!activeTab && incomingMatch && incomingMatch.length > 0 ? (
          //Schedule
          <div className="flex flex-col items-center justify-center ">
            {incomingMatch.map((schedule, index) => {
              const lastIndex = incomingMatch.length - 1
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <ScheduleMatch matchData={schedule} squadsMap={squadsMap}/>
                  {index < lastIndex && (
                    <Line
                      orientation="horizontal"
                      classNames={cx("xl:block border border-white my-8")}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ) : activeTab && resultMatchData && resultMatchData.length > 0 ? (
          // Result
          <div className="flex flex-col items-center justify-center ">
            {resultMatchData.map((schedule, index) => {
              const lastIndex = resultMatchData.length - 1
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <ScheduleResult resultMatchData={schedule} squadsMap={squadsMap} isBorder={true}/>
                  {index < lastIndex && (
                    <Line
                      orientation="horizontal"
                      classNames={cx("xl:block border border-white my-8")}
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
    </section>
  )
}
