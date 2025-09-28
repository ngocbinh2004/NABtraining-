import { Events } from 'interfaces/event_type'

export interface ITickets {
  id: number
  name: string
  event_id: number
  match_id?: number
  category_id?: number
  price?: number
  type?: string
  events?: Events
  active?: boolean
  description?: string
  qr_image?: string
  image?: string
}

export interface IUserTickets {
  id: number
  create_dt: string
  updated_dt: string
  ticket_id: number
  user_id: number
  status: string
  ticket: ITickets
}

export interface IFavoriteTickets {
  id: number
  create_dt: string
  user_id: number
  ticket_id: number
  ticket?: ITickets
  events?: Events
}
