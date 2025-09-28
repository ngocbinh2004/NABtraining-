import { IMatches } from './match_type'
import { Teams } from './team_type'
import { UserTeam } from './user_team_type'

export interface ISetRecord {
  attack_score?: number
  average?: string
  block_score?: number
  board?: number
  games?: number
  id: number
  serve_score?: number
  set_id: number
  total?: number
  user_team_id?: number
  user_team?: UserTeam
}

export interface ISet {
  id: number
  no?: number
  name: string
  match_id: number
  create_dt: Date
  updated_dt: Date
  team1_id: number
  team2_id: number
  team1_score: number
  team2_score: number
  winner_team_id?: number
  loser_team_id: number
  set_records?: ISetRecord[]
  team1?: Teams
  team2?: Teams
  match?: IMatches
}
