import { Image } from '@/molecules/media/Image'
import { cx } from 'class-variance-authority'
import { ITeamRecordType } from 'interfaces/team_record_type'
import { useTranslation } from 'next-i18next'
import { VscWorkspaceUnknown } from "react-icons/vsc"

export default function TeamRanking({
                                      teamData,
                                    }: {
  teamData: ITeamRecordType[]
}) {
  const { t } = useTranslation()

  const headerContent = [
    t('TeamRanking.ranking'),
    t('TeamRanking.team'),
    t('TeamRanking.match'),
    t('TeamRanking.matches_won'),
    t('TeamRanking.matches_lost'),
    t('TeamRanking.win_rate'),
    t('TeamRanking.lose_rate'),
    t('TeamRanking.points'),
    '3-0',
    '3-1',
    '3-2',
    '0-3',
    '1-3',
    '2-3',
    t('TeamRanking.sets_won'),
    t('TeamRanking.sets_lost'),
    t('TeamRanking.set_rate'),
    t('TeamRanking.points_scored'),
    t('TeamRanking.points_conceded'),
    t('TeamRanking.points_ratio'),
    t('TeamRanking.games_completed_rate'),
  ]

  const fieldKeys = [
    'matchesPlayed',
    'wins',
    'losses',
    'winRate',
    'loseRate',
    'points',
    'score_3_0',
    'score_3_1',
    'score_3_2',
    'score_0_3',
    'score_1_3',
    'score_2_3',
    'setsWon',
    'setsLost',
    'setWinRate',
    'pointsFor',
    'pointsAgainst',
    'pointsRatio',
    'gamesCompletedRate'
  ] as const


  return (
      <div className="w-full">
        <table className="w-full table-auto">
          <thead className="border-white border-b w-full font-bold">
          <tr className="text-white w-full">
            {headerContent.map((header, index) => (
                <th
                    key={index}
                    className={`p-4 text-sm lg:text-base w-max ${
                        index == 0 || index == 1 ? 'bg-black' : 'bg-[#202020]'
                    } text-center`}
                >
                  <span className="text-nowrap">{header}</span>
                </th>
            ))}
          </tr>
          </thead>
          <tbody className="text-white w-full">
          {teamData.map((team, index) => (
              <tr
                  key={team.id}
                  className="text-center border-white border-y w-full"
              >
                <td className="p-4 text-xs lg:text-base bg-[#002116] font-bold">{index + 1}</td>
                <td className="p-4 text-xs lg:text-base w-fit bg-[#002116] font-bold">
                  <div className="flex items-center justify-start w-fit">
                  {team.logo != "" ? (
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
                  </div>
                </td>
              
              {fieldKeys.map((key) => (
                <td
                  key={key}
                  className="p-4 text-xs lg:text-base w-fit font-bold bg-[#005235]"
                >
                  {team[key]}
                </td>
              ))}
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  )
}