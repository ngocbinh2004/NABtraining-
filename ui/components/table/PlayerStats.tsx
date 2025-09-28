import { IRoster as IRosterMatchStats } from "interfaces/match_stats_type"
import { IRoster as IRosterInfo } from "interfaces/roster_type"
import { useTranslation } from "next-i18next"

export default function PlayerStatsTable({ rostersMatchStats, rostersInfo }: { 
  rostersMatchStats: IRosterMatchStats[], rostersInfo: IRosterInfo[]
}){
  if (!rostersInfo.length) return null

  const { t } = useTranslation()
  const rosterMap = new Map<number, IRosterInfo>()
  rostersInfo.forEach((roster) => {
    rosterMap.set(roster.id, roster)
  })

  const filteredAndSortedRosters  = rostersMatchStats
    .filter((rms) => rms.squadId === rostersInfo[0]?.squadId)
    .sort((a, b) => b.score - a.score)

  const headerContent = [
    t("Schedule.PlayerData.player"), // Player
    t("Schedule.PlayerData.position"), // Position
    t("Schedule.PlayerData.attack_points"), // Attack Score
    t("Schedule.PlayerData.block_points"), // Block Score
    t("Schedule.PlayerData.serve_points"), // Serve Score
    t("Schedule.PlayerData.reception"), // Reception
    t("Schedule.PlayerData.dig"), // Dig
    t("Schedule.PlayerData.set"), // Set
    t("Schedule.PlayerData.total"), // Total Score
  ]

  const totals = filteredAndSortedRosters .reduce((acc, roster) => {
    acc.completedSpikes += roster.completedSpikes
    acc.completedBlocks += roster.completedBlocks
    acc.completedServes += roster.completedServes
    acc.completedPasses += roster.completedPasses
    acc.completedDefenses += roster.completedDefenses
    acc.completedSets += roster.completedSets
    acc.total += roster.score
    return acc
  }, {
    completedSpikes: 0,
    completedBlocks: 0,
    completedServes: 0,
    completedPasses: 0,
    completedDefenses: 0,
    completedSets: 0,
    total: 0
  })


  return (
    <div className="w-full overflow-x-auto border boxBlurShadow mb-6">
      <table className="w-full table-auto ">
        <thead className="text-white">
          <tr>
            {headerContent.map((header, index) => (
              <th
                key={index}
                className={`font-normal p-4 text-xs lg:text-base border-b ${
                  index < 2  ? "bg-black" : "bg-[#202020]"
                } text-center`}
              >
                <span className="text-nowrap">{header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white">
          {filteredAndSortedRosters .map(roster => {
            const rosterInfo = rosterMap.get(roster.rosterId)
            return(
            <tr key={roster.rosterId} className="border-b">
              <td className="p-2 pl-6 text-left text-xs lg:text-sm">
                {rosterInfo?.personalInfo.name} #{rosterInfo?.jerseyNumber}
              </td>
              <td className="p-2 text-xs lg:text-sm text-center">{rosterInfo?.position}</td>
              <td className="p-2 text-xs lg:text-sm text-center bg-[#005235] ">{roster.completedSpikes}</td>
              <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{roster.completedBlocks}</td>
              <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{roster.completedServes}</td>
              <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{roster.completedPasses}</td>
              <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{roster.completedDefenses}</td>
              <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{roster.completedSets}</td>
              <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{roster.score}</td>
            </tr>
            )
          })}
          <tr className="border-t">
            <td className="p-2 text-center text-xs lg:text-sm bg-black" colSpan={2}>
              {t("Schedule.PlayerData.summary")}
            </td>
            <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{totals.completedSpikes}</td>
            <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{totals.completedBlocks}</td>
            <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{totals.completedServes}</td>
            <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{totals.completedPasses}</td>
            <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{totals.completedDefenses}</td>
            <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{totals.completedSets}</td>
            <td className="p-2 text-xs lg:text-sm text-center bg-[#005235]">{totals.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}