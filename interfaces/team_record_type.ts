export interface ITeamRecordType {
  id: number
  name: string
  logo: string
  matchesPlayed: number
  wins: number
  losses: number
  winRate: string
  loseRate: string
  points: number
  score_3_0: number
  score_3_1: number
  score_3_2: number
  score_0_3: number
  score_1_3: number
  score_2_3: number
  setsWon: number
  setsLost: number
  setWinRate: string
  pointsFor: number
  pointsAgainst: number
  pointsRatio: string
  gamesCompletedRate: string
}