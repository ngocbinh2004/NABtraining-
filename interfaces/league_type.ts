export interface ILeague {
  id: number
  create_dt: string
  updated_dt: string
  created_by: number
  updated_by: number
  name: string
  year: number
  start_date: string
  end_date: string
  status: string
  rules?: string
  guiding_unit?: string
  sponsor?: string
  co_organizer?: string
}