import { cx } from "class-variance-authority"
import { useTranslation } from "next-i18next"
// ui
import Image from "@/molecules/media/Image"
import Text from "@/atoms/Text"
import { VscWorkspaceUnknown } from "react-icons/vsc"

interface HorizontalTeamBlockProps {
  team: {
    name: string
    logoUrl?: string
  }
  typeLabel?: "所屬" | "對戰",
  isMobile?: boolean
}

export default function HorizontalTeamBlock({
  team,
  typeLabel,
  isMobile = false,
}: HorizontalTeamBlockProps) {
  const { t } = useTranslation()

  const teamLogoMap: Record<string, string> = {
    "新北伊斯特": "/assets/logo-sky.png",
    "臺中連莊": "/assets/logo-taichung.png",
    "桃園雲豹飛將": "/assets/logo-taoyuan.png",
    "台鋼天鷹": "/assets/logo-sky.png",
    "臺北伊斯特": "/assets/logo-taipei.png",
    "台南天鷹": "/assets/logo-skyhawks.png",
  }

  const teamLogo = team?.logoUrl || (team?.name ? teamLogoMap[team.name] : "") || ""

  const translatedLabel =
    typeLabel === "所屬"
      ? t("Schedule.home")
      : typeLabel === "對戰"
        ? t("Schedule.away")
        : ""

  const labelStyle =
    typeLabel === "所屬"
      ? "bg-[#009465] text-white"
      : typeLabel === "對戰"
        ? "bg-white text-[#004F36]"
        : "";

  const renderLabel = translatedLabel && (
    <div className={cx("px-2 py-0.5 text-[14px] font-semibold whitespace-nowrap", labelStyle)}>
      {translatedLabel}
    </div>
  )

  const renderLogo = (
    teamLogo != "" ? (
      <Image
        url={teamLogo}
        alt={team.name || "Team Logo"}
        width={isMobile ? 40 : 32}
        height={isMobile ? 40 : 32}
        imageClassNames={isMobile ? "h-[40px] w-auto mt-[8px]" : "h-[32px] w-auto"}
      />
    ) : (
      <VscWorkspaceUnknown className="text-[#009465]" size={isMobile ? 40 : 32} />
    )
  );


  const renderName = (
    <Text classNames={cx(
        "text-white text-[14px] font-bold min-w-[80px] md:max-w-[250px]",
        isMobile && "text-center"
      )}
    >
    {team?.name}
    </Text>
  )

  if (isMobile) {
    // 🟩 Mobile = 1 column layout
    return (
      <div className="flex flex-col items-center gap-3">
        {renderLogo}
        {renderName}
        {renderLabel}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-[4px] lg:gap-[6px]">
      {typeLabel === "所屬" ? (
        <>
          {renderLogo}
          <div className="flex items-center gap-3">
            {renderName}
            {renderLabel}
          </div>
        </>
      ) : (
        <>
          <div className="mr-2">{renderLabel}</div>
          {renderLogo}
          {renderName}
        </>
      )}
    </div>
  )
}
