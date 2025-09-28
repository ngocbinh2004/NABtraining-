import { cx } from "class-variance-authority"
import { useTranslation } from "next-i18next"
//ui
import Image from "@/molecules/media/Image"
import Text from "@/atoms/Text"
//constants
import { Teams } from "interfaces/new_team_type"
import { VscWorkspaceUnknown } from "react-icons/vsc"

interface TeamBlockProps {
  team: Teams | null
  isLeft?: boolean
  isMobile?: boolean
}

export default function TeamBlock({ team, isLeft, isMobile }: TeamBlockProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cx(
        "w-[50%] flex items-center gap-2 lg:gap-[32px] lg:justify-end flex-col-reverse",
        isLeft
          ? "lg:flex-row justify-center"
          : "lg:flex-row-reverse justify-center"
      )}
    >
      <div className="hidden lg:flex flex-col justify-center">
        <Text
          classNames={cx(
            "font-semibold text-white text-[20px] mb-2",
            isLeft ? "text-right" : "text-left"
          )}
          size="unset"
        >
          {team?.name}
        </Text>
        <Text
          classNames={cx(
            "font-semibold text-white text-[16px] mb-2",
            isLeft ? "text-right" : "text-left"
          )}
          size="unset"
        >
          {team?.altName}
        </Text>
      </div>
      <div className="lg:hidden justify-center items-center">
        <Text classNames="font-semibold text-white text-[16px] text-center mb-2 whitespace-pre-line">
          {(() => {
            const name = team?.altName || team?.name || "";
            const words = name.split(" ");

            if (words.length > 2) {
              // Split words into two nearly equal halves
              const mid = Math.ceil(words.length / 2);
              return words.slice(0, mid).join(" ") + "\n" + words.slice(mid).join(" ");
            }
            return name;
          })()}
        </Text>
      </div>

      <div className="flex flex-col justify-center items-center">
        {team?.logoUrl ? (
          <Image
            url={team.logoUrl}
            alt={team.name || "Team Logo"}
            width={isMobile ? 69 : 104}
            height={isMobile ? 69 : 104}
          />
        ) : (
          <VscWorkspaceUnknown className="text-[#009465]" size={isMobile ? 69 : 104} />
        )}
        <div
          className={cx(
            "flex justify-center items-center h-[32px] mt-2 w-[69px] lg:w-[104px]",
            isLeft ? "bg-[#009465] text-white" : "bg-white text-[#004F36]"
          )}
        >
          <span className="font-semibold text-[12px] lg:text-[16px] text-center">
            {isLeft ? t("Schedule.away") : t("Schedule.home")}
          </span>
        </div>
      </div>
    </div>
  )
}
