import { ICategory } from './category_type'
import { IMatches } from './match_type'
import { Teams } from './team_type'

export interface Events {
  id: number
  created_at: Date
  updated_at: Date
  name: string
  start_date?: number
  end_date?: number
  register_start_date?: number
  register_end_date?: number
  status: string
  image?: string
  matches: IMatches[]
  location?: string
  team1?: Teams
  team2?: Teams
  user_id?: number
  category_id?: number
  category?: ICategory
  description?: string
  rules?: string
  guiding_unit?: string
  sponsor?: string
  co_organizer?: string
  team_capacity?: number
  host?: {
    name?: string
  }
}

export interface IApiEvent {
  id: number;
  seasonId: number;
  name: string;
  registrationStartTime: string;
  registrationEndTime: string;
  status: string;
  gender: string;
  allowSquadClassifications: string[] | null;
}