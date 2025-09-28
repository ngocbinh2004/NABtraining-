import { Teams } from './team_type'
import { ISet } from './set_type'

export interface IMatches {
  id: number
  create_dt: string
  updated_dt: string
  created_by: number
  updated_by: number
  name: string
  status: string
  team1_id: number
  team2_id: number
  team1_score: number
  team2_score: number
  start_date?: string
  end_date?: string
  location?: string
  winner_team_id?: number
  loser_team_id?: number
  event_id?: number
  team1_win: number
  team2_win: number
  rank_table_id?: number
  category_id?: number
  team1: Teams
  team2: Teams
  match_set?: ISet[]
}
