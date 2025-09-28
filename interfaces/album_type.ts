import { IMatches } from 'interfaces/match_type'
import { IPhoto } from 'interfaces/photo_type'
export interface IAlbum {
  id: number
  create_dt: string
  updated_dt: string
  created_by: number
  updated_by: number
  name: string
  match_id: number
  match: IMatches[]
  photos: IPhoto[]
}
