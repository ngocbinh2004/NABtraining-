import { ITeamRecordType } from "interfaces/team_record_type";
import { ISquad as squadMatchStats } from "interfaces/match_stats_type";
import { ISquad } from "interfaces/squad_detail_type";

const initTeamRecord = (): ITeamRecordType => ({
  id: 0,
  name: "",
  logo: "",
  matchesPlayed: 0,
  wins: 0,
  losses: 0,
  winRate: "0%",
  loseRate: "0%",
  points: 0,
  score_3_0: 0,
  score_3_1: 0,
  score_3_2: 0,
  score_0_3: 0,
  score_1_3: 0,
  score_2_3: 0,
  setsWon: 0,
  setsLost: 0,
  setWinRate: "0%",
  pointsFor: 0,
  pointsAgainst: 0,
  pointsRatio: "0%",
  gamesCompletedRate: "0%",
});

const createTeamRecord = (
  matchStatsArr: squadMatchStats[],
  squad: ISquad,
  numberOfSquads: number,
): ITeamRecordType => {
  const teamRecord = matchStatsArr.reduce<ITeamRecordType>((acc, match) => {
    acc.wins += match.wonRoundCount > match.lostRoundCount ? 1 : 0;
    acc.losses += match.wonRoundCount < match.lostRoundCount ? 1 : 0;

    acc.score_3_0 += match.wonRoundCount === 3 && match.lostRoundCount === 0 ? 1 : 0;
    acc.score_3_1 += match.wonRoundCount === 3 && match.lostRoundCount === 1 ? 1 : 0;
    acc.score_3_2 += match.wonRoundCount === 3 && match.lostRoundCount === 2 ? 1 : 0;
    acc.score_0_3 += match.wonRoundCount === 0 && match.lostRoundCount === 3 ? 1 : 0;
    acc.score_1_3 += match.wonRoundCount === 1 && match.lostRoundCount === 3 ? 1 : 0;
    acc.score_2_3 += match.wonRoundCount === 2 && match.lostRoundCount === 3 ? 1 : 0;

    acc.setsWon += match.wonRoundCount;
    acc.setsLost += match.lostRoundCount;
    acc.pointsFor += match.wonScore;
    acc.pointsAgainst += match.lostScore;

    return acc;
  }, initTeamRecord());

  const matchesCount = matchStatsArr.length;

  teamRecord.id = squad.id;
  teamRecord.name = squad.name;
  teamRecord.logo = squad.logoUrl;
  teamRecord.matchesPlayed = matchesCount;

  teamRecord.winRate =
    matchesCount === 0
      ? "0%"
      : `${((teamRecord.wins / matchesCount) * 100).toFixed(1)}%`;

  teamRecord.loseRate =
    matchesCount === 0
      ? "0%"
      : `${((teamRecord.losses / matchesCount) * 100).toFixed(1)}%`;

  teamRecord.points =
    teamRecord.score_3_0 * 3 +
    teamRecord.score_3_1 * 3 +
    teamRecord.score_3_2 * 2 +
    teamRecord.score_2_3 * 1;

  const totalSets = teamRecord.setsWon + teamRecord.setsLost;
  teamRecord.setWinRate = totalSets
    ? `${((teamRecord.setsWon / totalSets) * 100).toFixed(1)}%`
    : "0%";

  teamRecord.pointsRatio =  teamRecord.pointsAgainst !== 0
    ? `${((teamRecord.pointsFor / teamRecord.pointsAgainst) * 100).toFixed(1)}%`
    : "0%";

  const totalMatches = (numberOfSquads * (numberOfSquads - 1)) / 2;
  teamRecord.gamesCompletedRate = totalMatches !== 0 
    ? `${((teamRecord.matchesPlayed / totalMatches) * 100).toFixed(1)}%`
    : "0%";

  return teamRecord;
};

export default createTeamRecord;
