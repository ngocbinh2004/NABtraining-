export interface IVideo {
  id: number
  create_dt: string
  updated_dt: string
  name: string
  url: string
  description?: string
  event_id?: number
  status?: string
  type?: string
}
