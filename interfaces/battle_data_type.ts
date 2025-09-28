export interface IRecord {
  opponent: string;
  opponentId: number;
  result: string;
}

export default interface IBattleData {
  squadId: number;
  name: string;
  team_logo: string;
  record: IRecord[];
}