import { Users } from 'interfaces/user_type'
import { Teams } from 'interfaces/team_type'
import { Events } from 'interfaces/event_type'

export interface UserTeam {
  id: number
  role: string
  user_id: number
  team_id: number
  event_id?: number
  user: Users
  team: Teams
  event?: Events
  player_no?: number
  spike?: number
  block?: number
  position?: string
}
