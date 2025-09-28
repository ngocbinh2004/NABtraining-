import { ISquad } from "./squad_detail_type";

export interface IAction{
  success: number;
  attackTotal: number;
  successRate: number | string;
}

export interface ProfileMatch {
  id: number;
  eventId: number;
  seasonId: number;
  matchedAt: string;
  gameCode: string;
  venue: string;
  homeTeam: ISquad;
  awayTeam: ISquad;
  homeScore: number;
  awayScore: number;
  attack: IAction;
  block: IAction;
  serve: IAction;
  pass: IAction;
  defense: IAction;
  set: IAction;
}

export interface PlayerData {
  name: string;
  position: string;
  age: number;
  birthdate: string;
  school: string;
  experience: string;
  jerseyNumber: string;
  squadName: string;
  squadLogo: string;
  imageUrl: string;
  attackPoints: number;
  blockPoints: number;
  servePoints: number;
  passes: number;
  defenses: number;
  sets: number;
  totalPoints: number;
}