import { ISquad } from "./squad_detail_type"

export interface TeamData {
  squadId: number;
  set_1_score: number;
  set_2_score: number;
  set_3_score: number;
  set_4_score: number | null
  set_5_score: number | null
  accumulated_score: number;
  wonRound: number
  isHome: boolean
  squadInfo: ISquad
}