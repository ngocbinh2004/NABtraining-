import { ITeamRecordType } from "./team_record_type"

export interface ILeagueRankingType {
  seasonId: number
  eventId: number
  year: number
  eventName: string
  teams_record: ITeamRecordType[]
}