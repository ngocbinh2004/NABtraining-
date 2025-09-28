import { ICategory } from './category_type'
import { Users } from './user_type'

export interface IUserEvent {
  id: number
  create_dt?: string
  updated_dt?: string
  created_by?: number
  updated_by?: number
  name: string
  start_date?: string
  end_date?: string
  status?: string
  location?: string
  category_id?: number
  image?: string
  description?: string
  rules?: string
  guiding_unit?: string
  sponsor?: string
  co_organizer?: string
  register_start_date?: string
  register_end_date?: string
  team_capacity?: number
  category?: ICategory
  created_by_user?: Users
  hosted?: boolean
}
