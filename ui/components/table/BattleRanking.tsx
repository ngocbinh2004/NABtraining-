import { Image } from '@/molecules/media/Image'
import { cx } from 'class-variance-authority'
import IBattleData from 'interfaces/battle_data_type'
import { useTranslation } from 'next-i18next'
import { VscWorkspaceUnknown } from "react-icons/vsc"

export default function BattleRanking({
  battleData,
}: {
  battleData: IBattleData[]
}) {
  const { t } = useTranslation()
  return (
    <div className="w-full ">
      <table className="w-full table-auto">
        <thead className=" border-white border-b">
          <tr className="text-white font-bold">
            <th className="p-4 text-sm lg:text-base bg-black w-fit font-bold">
              <span className="text-nowrap">{t('TeamRanking.ranking')}</span>
            </th>
            <th className="p-4 text-sm lg:text-base bg-black w-fit font-bold">
              <span className="text-nowrap">{t('TeamRanking.team')}</span>
            </th>
            {battleData.map((team, index) => (
              <th
                key={index}
                className={`p-4 text-sm lg:text-base bg-[#202020]`}
              >
                <span className="text-nowrap">{team.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white font-bold">
          {battleData.map((battles, index) => {
            return (
              <tr
                key={battles.squadId}
                className="text-center border-white border-y w-full"
              >
                <td className="p-4 text-xs lg:text-base ">{index + 1}</td>
                <td className="p-4 text-xs lg:text-base w-fit">
                  <div className="flex items-center justify-start w-fit">
                    {battles.team_logo != "" ? (
                    <Image
                      url={battles.team_logo}
                      alt={battles.name}
                      classNames="h-8 w-8 mr-3 min-h-8 min-w-8"
                      imageClassNames="h-full w-full"
                      objectFit="cover"
                      quality={100}
                    />
                  ) : (
                    <VscWorkspaceUnknown className="text-[#0DA95F] mr-4" size={32} />
                  )}
                    <span className="text-nowrap">{battles.name}</span>
                  </div>
                </td>

                {battles.record.map((record, index) => {
                  return (
                    <td
                      key={index}
                      className="p-4 text-xs lg:text-base w-fit font-bold background-green"
                    >
                      {record.result !== "-" ? (
                        <span>{record.result}</span>
                      ) : (
                        <div className="flex justify-center items-center w-full h-full">
                          <Image
                            url="assets/yellow_logo.png"
                            alt="yellow logo"
                            height={16}
                            width={46}
                            classNames="h-4 w-4"
                            imageClassNames="h-full"
                            objectFit="cover"
                          />
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
