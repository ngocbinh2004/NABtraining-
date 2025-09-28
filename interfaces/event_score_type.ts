import { ISet } from './set_type'

export interface EventScores {
  [key: string]: {
    team_id?: number
    logo?: string
    win?: number
    lose?: number
    gp?: number
    pct?: number
    sets?: ISet[]
  }
}
