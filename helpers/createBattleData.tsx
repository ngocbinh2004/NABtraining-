import { ISquad } from "interfaces/squad_detail_type";
import { ISquad as squadMatchStats } from "interfaces/match_stats_type";
import IBattleData from "interfaces/battle_data_type";
import { ISchedules } from "interfaces/schedule_type";
import { IRecord } from "interfaces/battle_data_type";

const createBattleData = (
  matchStatsArr: squadMatchStats[],
  squad: ISquad,
  matchMap: Map<number, ISchedules>,
  recordArr: IRecord[],
): IBattleData => {
  const battleData: IBattleData = {
    squadId: squad.id,
    name: squad.name,
    team_logo: squad.logoUrl,
    record: recordArr.map(r => ({ ...r })),
  };

  if(matchStatsArr.length === 0){
    return battleData;
  }

  for (const matchStats of matchStatsArr) {
    const match = matchMap.get(matchStats.matchId);
    if (!match) continue;

    const opponentSquadId =
      match.homeSquadId === squad.id ? match.awaySquadId : match.homeSquadId;

    if (opponentSquadId) {
      const result = match.squadMatchResults?.find(
        (r) => r.squadId === squad.id
      );

      const matchResult = result
        ? `${result.wonRounds} - ${result.lostRounds}`
        : "-";

      const record = battleData.record.find(bd => bd.opponentId === opponentSquadId);
      if (record) {
        record.result = matchResult;
      }
    }
  }

  return battleData;
};

export default createBattleData;
