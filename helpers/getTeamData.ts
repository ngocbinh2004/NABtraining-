import { ISchedules } from "interfaces/schedule_type"
import { TeamData } from "interfaces/team_data_type"
import { ISquad } from "interfaces/squad_detail_type"
import IMatchStats from "interfaces/match_stats_type"

export function getHomeAwayTeamData(
  schedule: ISchedules,
  homeTeamInfo: ISquad,
  awayTeamInfo: ISquad,
  matchStats: IMatchStats,
): TeamData[] {
  if (!schedule || !homeTeamInfo || !awayTeamInfo || !matchStats) {
    console.warn("Invalid input data", { schedule, homeTeamInfo, awayTeamInfo, matchStats });
    return [];
  }
  if (schedule.sportName !== "Volleyball") return [];

  function calculatedData(
    data: IMatchStats, 
    homeTeamInfo: ISquad, 
    awayTeamInfo: ISquad, 
    schedule: ISchedules
  ): TeamData[] {

    const results: TeamData[] = [];
    const squadIds = [awayTeamInfo.id, homeTeamInfo.id];

    const teamInfoMap = new Map<number, ISquad>([
      [homeTeamInfo.id, homeTeamInfo],
      [awayTeamInfo.id, awayTeamInfo],
    ])

  const squadMatchResults = schedule.squadMatchResults || []

  // Find data for home & away teams
  const homeResult = squadMatchResults.find(
    (r) => r.squadId === schedule.homeSquadId
  )
  const awayResult = squadMatchResults.find(
    (r) => r.squadId === schedule.awaySquadId
  )

    for (const squadId of squadIds) {
      // Filter rosters have the same squadId
      const squadRosters = data.rosters.filter(r => r.squadId === squadId);

      // calculate score for each of round
      const roundScores: Record<number, number | null> = {
        1: 0,
        2: 0,
        3: 0,
        4: null,
        5: null,
      };

      for (const roster of squadRosters) {
        if (Array.isArray(roster.rounds)) {
          for (const round of roster.rounds) {
            const roundNumber = round.round ?? 0;
            if (roundNumber >= 1 && roundNumber <= 5) {
              // If there are round 4 or 5 then set from null to 0
              if (roundScores[roundNumber] === null) {
                roundScores[roundNumber] = 0;
              }
              roundScores[roundNumber]! += round.score || 0;
            }
          }
        }
      }

      // Calulate the total score
      const accumulated = Object.values(roundScores).filter((v): v is number => v !== null).reduce((sum, val) => sum + val, 0);

      const isHome = squadId === schedule.homeSquadId;

      results.push({
        squadId,
        set_1_score: roundScores[1] ?? 0,
        set_2_score: roundScores[2] ?? 0,
        set_3_score: roundScores[3] ?? 0,
        set_4_score: roundScores[4] ?? null,
        set_5_score: roundScores[5] ?? null,
        accumulated_score: accumulated,
        wonRound: isHome ? (homeResult?.wonRounds ?? 0) : (awayResult?.wonRounds ?? 0),
        isHome: isHome,
        squadInfo: teamInfoMap.get(squadId)!,
      });
  }

    return results;
}

  return calculatedData(matchStats, homeTeamInfo, awayTeamInfo, schedule)
}