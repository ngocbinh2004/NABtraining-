import { Events } from './event_type'
import { IMatches } from './match_type'

export interface IRankTableTeam {
  id: number
  name: string
  logo?: string
  stat?: {
    won: number
    total_difference: number
  }
}

export interface IRankTable {
  id: number
  name: string
  event_id: number
  teams?: IRankTableTeam[]
  event?: Events[]
  matches?: IMatches[]
}
