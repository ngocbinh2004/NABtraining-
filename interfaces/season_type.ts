export interface ISeason {
  id: number;
  leagueId: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface ISelectionSeason {
  seasonId: number;
  seasonYear: string;
}