import { Image } from "@/molecules/media/Image"
import { useTranslation } from "next-i18next"
import { TeamData } from "interfaces/team_data_type"
import { VscWorkspaceUnknown } from "react-icons/vsc"

export default function GameStats({ teamData }: { teamData: TeamData[] }) {
  const { t } = useTranslation()

  const headerContent = [
    t("Schedule.CompetitionData.team"),
    t("Schedule.CompetitionData.set_1"),
    t("Schedule.CompetitionData.set_2"),
    t("Schedule.CompetitionData.set_3"),
    teamData[0]?.set_4_score != null && t("Schedule.CompetitionData.set_4"),
    teamData[0]?.set_5_score != null && t("Schedule.CompetitionData.set_5"),
    t("Schedule.CompetitionData.accumulated"),
    t("Schedule.CompetitionData.total_ratio")
  ].filter(Boolean)

  return (
    <div className="w-full overflow-x-autow-full overflow-x-auto border boxBlurShadow mb-6">
      <table className="w-full table-auto border boxBlurShadow ">
        <thead className="border-white">
          <tr className="text-white">
            {headerContent.map((header, index) => (
              <th
                key={index}
                className={`font-normal p-4 text-xs lg:text-base ${index === 0 ? "bg-black" : "bg-[#202020]"
                  } text-center`}
              >
                <span className="text-nowrap">{header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white">
          {teamData.map((team) => (
            <tr key={team.squadId} className="text-center border-white border-y">
              <td className="p-4 text-xs lg:text-base w-fit">
                <div className="flex items-center justify-start">
                  {team.squadInfo.logoUrl != "" ? (
                    <Image
                      url={team.squadInfo.logoUrl}
                      alt={team.squadInfo.name}
                      classNames="h-8 w-8 mr-3 min-h-8 min-w-8"
                      imageClassNames="h-full w-full"
                      objectFit="cover"
                      quality={100}
                    />
                  ) : (
                    <VscWorkspaceUnknown className="text-[#009465] mr-4" size={32} />
                  )}
                  <span className="text-nowrap">{team.squadInfo.name}</span>
                </div>
              </td>
              <td className="p-4 text-xs lg:text-base bg-[#005235]">{team.set_1_score}</td>
              <td className="p-4 text-xs lg:text-base bg-[#005235]">{team.set_2_score}</td>
              <td className="p-4 text-xs lg:text-base bg-[#005235]">{team.set_3_score}</td>
              {team.set_4_score != null && (
                <td className="p-4 text-xs lg:text-base bg-[#005235]">{team.set_4_score}</td>
              )}
              {team.set_5_score != null && (
                <td className="p-4 text-xs lg:text-base bg-[#005235]">{team.set_5_score}</td>
              )}
              <td className="p-4 text-xs lg:text-base bg-[#005235]">
                {team.accumulated_score}
              </td>
              <td className="p-4 text-xs lg:text-base bg-[#005235]">{team.wonRound}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
