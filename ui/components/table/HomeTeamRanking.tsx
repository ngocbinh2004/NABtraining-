import { Image } from "@/molecules/media/Image";
import { cx } from "class-variance-authority";
import { ITeamRecordType } from "interfaces/team_record_type";
import { useTranslation } from "next-i18next";
import { VscWorkspaceUnknown } from "react-icons/vsc"

export default function HomeTeamRanking({ teamData }: { teamData: ITeamRecordType[] }) {
  const { t } = useTranslation();

  const headerContent = [
    t("TeamRanking.ranking"),
    t("TeamRanking.team"),
    t("TeamRanking.HomePage.match"),
    t("TeamRanking.HomePage.matches_won"),
    t("TeamRanking.HomePage.matches_lost"),
    t("TeamRanking.win_rate"),
    t("TeamRanking.sets_won"),
    t("TeamRanking.HomePage.sets_lost"),
    t("TeamRanking.points_scored"),
    t("TeamRanking.points_conceded"),
  ];

  return (
    <div className="w-full">
      <table className="w-full table-auto border border-white boxBlurShadow border-collapse">
        <thead className="w-full">
          <tr className="text-white w-full">
            {headerContent.map((header, index) => (
              <th
                key={index}
                className={cx(
                  "p-4 text-sm lg:text-base w-max text-center",
                  index === 0 || index === 1 ? "bg-black font-bold" : "bg-[#202020]"
                )}
              >
                <span className="text-nowrap">{header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white w-full">
          {teamData.map((team, index) => {
            const teamCells = [
              index + 1,
              <div className="flex items-center justify-start w-fit">
                {team.logo ? (
                  <Image
                    url={team.logo}
                    alt={team.name}
                    classNames="h-8 w-8 mr-3 min-h-8 min-w-8"
                    imageClassNames="h-full w-full"
                    objectFit="cover"
                    quality={100}
                  />
                ) : (
                  <VscWorkspaceUnknown className="text-[#0DA95F] mr-4" size={32} />
                )}
                <span className="text-nowrap">{team.name}</span>
              </div>,
              team.matchesPlayed,
              team.wins,
              team.losses,
              team.winRate,
              team.setsWon,
              team.setsLost,
              team.pointsFor,
              team.pointsAgainst,
            ];
            
            return (
              <tr key={team.id} className="text-center border-y w-full text-white">
                {teamCells.map((cell, i) => (
                  <td key={i} className={cx(
                    "p-4 text-xs lg:text-base font-bold",
                    (i === 0 || i === 1) ? "bg-[#002116]" : "bg-[#005235]"
                  )}>
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}