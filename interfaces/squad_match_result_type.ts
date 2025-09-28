export interface ISquadMatchResult {
  matchId: number;
  squadId: number;
  opponentSquadId: number;
  wonScore: number;
  lostScore: number;
  wonRounds: number;
  lostRounds: number;
  drawRounds: number;
}