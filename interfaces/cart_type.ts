import { ITickets } from 'interfaces/ticket_type'
import { Events } from 'interfaces/event_type'

export interface ICart {
  id: number
  ticket_id: string
  ticket?: ITickets
  event?: Events
}
