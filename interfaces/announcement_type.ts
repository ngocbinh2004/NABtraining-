import { Users } from './user_type'
export interface IAnnouncement {
  id: number
  create_dt: string
  update_dt: string
  created_by?: string
  created_by_user?: Users
  updated_by?: number
  updated_by_user?: Users
  category: string
  title: string
  contents: string
  language: string
}
