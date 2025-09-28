import { Teams } from 'interfaces/team_type'
import { Events } from 'interfaces/event_type'

export interface IRegisteredTeam {
  id: number
  create_dt?: string
  updated_dt?: string
  event_id: number
  team_id: number
  team: Teams
  created_by?: number
  event?: Events
}
