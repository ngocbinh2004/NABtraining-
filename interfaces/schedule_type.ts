import { ISquadMatchResult } from 'interfaces/squad_match_result_type';

export interface ISchedules {
  id: number
  leagueId: number
  seasonId: number
  eventId: number
  divisionId: number
  poolId: number
  homeSquadId: number
  awaySquadId: number
  code: string
  status: string
  matchedAt: string
  matchedTimezoneOffset: string
  venue: string
  court: string
  round: number
  squadMatchResults: ISquadMatchResult[]
  sportName: string
  isStatsManualInput: boolean
}