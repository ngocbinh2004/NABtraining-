import { cx } from "class-variance-authority"
import { useTranslation } from "next-i18next"
// ui
import Image from "@/molecules/media/Image"
import Text from "@/atoms/Text"

interface VerticalTeamBlockProps {
    team: {
        name: string
        logo?: string
    }
    typeLabel?: "所屬" | "對戰"
}

export default function VerticalTeamBlock({
                                              team,
                                              typeLabel,
                                          }: VerticalTeamBlockProps) {
    const { t } = useTranslation()

    const teamLogoMap: Record<string, string> = {
        "新北伊斯特": "/assets/logo-sky.png",
        "臺中連莊": "/assets/logo-taichung.png",
        "桃園雲豹飛將": "/assets/logo-taoyuan.png",
        "台鋼天鷹": "/assets/logo-sky.png",
        "臺北伊斯特": "/assets/logo-taipei.png",
        "台南天鷹": "/assets/logo-skyhawks.png",
    }

    const teamLogo = team?.logo || (team?.name ? teamLogoMap[team.name] : "") || ""

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
                : ""

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Logo */}
            <div className="flex items-center">
                <Image
                    url={teamLogo}
                    alt={team?.name || "Team Logo"}
                    width={40}
                    height={40}
                    imageClassNames="h-[40px] w-auto max-h-[40px]"
                />
            </div>

            {/* Name */}
            <div className="flex items-center">
                <Text classNames="text-white !text-[14px] font-bold">{team?.name}</Text>
            </div>

            {/* Label */}
            {translatedLabel && (
                <div className={cx("px-2 py-0.5 text-[16px] font-semibold", labelStyle)}>
                    {translatedLabel}
                </div>
            )}
        </div>
    )
}
