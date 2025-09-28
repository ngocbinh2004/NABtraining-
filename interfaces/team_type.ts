import { ICategory } from "./category_type"

export interface Teams {
  id: number
  create_dt: string
  updated_dt: string
  created_by: number
  updated_by: number
  name: string
  english_name: string
  abbreviation: string
  logo?: string
  matches: number
  win: number
  lose: number
  points: number
  total_score: number
  total_conceed: number
  total_difference: number
  established?: string
  description?: string
  ticket_link?: string
  category_id?: number
  category?: ICategory
}
